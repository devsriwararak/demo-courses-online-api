import pool from "../db/index.js";
import multer from "multer";
import handleImageUpload, { handleVideoUpload } from "../libs/uploadFile.js";
const upload = multer({ storage: multer.memoryStorage() });

export const addNewProduct = async (req, res) => {
  const { title, dec, price, price_sale, image, category_id } = req.body;
  // console.log(req.body);
  const videoFile = req.file;
  const db = await pool.connect();
  try {
    // เช็คข้อมูลซ้ำ
    const sqlCheck = `SELECT id FROM products WHERE title = $1`;
    const resultCheck = await db.query(sqlCheck, [title]);
    if (resultCheck.rows.length > 0)
      return res.status(400).json({ message: "มีคลิปนี้ในระบบแล้ว" });

    if (!videoFile) {
        return res.status(400).json({ message: "Video file is required" });
      }

    // อัพโหลดรูปภาพไปยัง FTP server
    const imageName = await handleImageUpload(image);

    // อัพโหลดวีดีโอไปยัง FTP server
    const videoName = await handleVideoUpload(videoFile);

    // บันทึกข้อมูลลงฐานข้อมูล
    const result = await db.query(
      "INSERT INTO products (title, dec, price, price_sale, image, video, category_id) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [title, dec, price, price_sale, imageName, videoName, category_id]
    );

   return res.status(200).json({message : 'บันทึกสำเร็จ'})
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const getAllProducts = async(req,res)=> {
    const {search} = req.body
    const db = await pool.connect()
    try {
        console.log(search);
        const sql = `SELECT * FROM products`
        const result = await db.query(sql)
        return res.status(200).json(result.rows)
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.message)
    }finally {
      db.release()
    }
}

export const uploadMiddleware = upload.single("video");
