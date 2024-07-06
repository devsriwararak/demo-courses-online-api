import pool from "../db/index.js";
import multer from "multer";
import handleImageUpload, { handleVideoUpload } from "../libs/uploadFile.js";
import { deleteImageFtp } from "../libs/ftpClient.js";
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
    await db.query(
      "INSERT INTO products (title, dec, price, price_sale, image, video, category_id) VALUES ($1, $2, $3, $4, $5,$6,$7) ",
      [title, dec, price, price_sale, imageName, videoName, category_id]
    );

    return res.status(200).json({ message: "บันทึกสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};
export const uploadMiddleware = upload.single("video");

export const getAllProducts = async (req, res) => {
  const { search } = req.body;
  const db = await pool.connect();
  try {
    // paginations
    const page = parseInt(req.body.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const sqlPage = `SELECT COUNT(id) FROM products`;
    const resultPage = await db.query(sqlPage);
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = `SELECT id, title, dec, price, price_sale,image, video, category_id FROM products`;
    const params = [limit, offset];
    if (search) {
      sql += ` WHERE title LIKE $3`;
      params.push(`%${search}%`);
    }

    sql += ` LIMIT $1 OFFSET $2`;

    const result = await db.query(sql, params);
    return res.status(200).json({
      page,
      limit,
      totalPages,
      totalItems,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  const db = await pool.connect();
  try {
    const sql = `SELECT id, title, dec, price, price_sale,image, video, category_id FROM products WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  const db = await pool.connect();
  try {
    const sql = `DELETE FROM products WHERE id = $1`;
    await db.query(sql, [id]);
    return res.status(200).json({ message: "ลบสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const editProductByid = async (req, res) => {
  const { id, title, dec, price, price_sale, image, category_id } = req.body;
  const videoFile = req.file;
  const db = await pool.connect();
  try {
    if (!id) return res.status(400).json({ message: "ส่งข้อมูลมาไม่ครบ" });

    // เช็คไม่ให้ข้อมูลซ้ำ ยกเว้นตัวเอง
    const sqlCheck = `SELECT id FROM products WHERE title = $1 AND id != $2`;
    const resultCheck = await db.query(sqlCheck, [title, id]);
    if (resultCheck.rows.length > 0)
      return res.status(400).json({ message: "มีหัวข้อนี้แล้ว" });

    // ดึงข้อมูลรูป และวีดีโอเก่า
    const sqlOld = `SELECT id, image, video FROM products WHERE id = $1`;
    const resultOld = await db.query(sqlOld, [id]);

    let imageName = resultOld.rows[0].image;
    let videoName = resultOld.rows[0].video;

    if (image !== resultOld.rows[0].image) {
      await deleteImageFtp(`/images/${resultOld.rows[0].image}`); // ลบรูปเก่าก่อน
      imageName = await handleImageUpload(image); // upload รูปใหม่ base64
    }

    if (videoFile) {
      await deleteImageFtp(`/videos/${resultOld.rows[0].video}`); // ลบวีดีโอเก่าก่อน
      videoName = await handleVideoUpload(videoFile);
    }

    // บันทึกลง SQL 
    const sql = `UPDATE products SET title = $1, dec = $2, price = $3, price_sale = $4, image = $5, video = $6, category_id = $7 WHERE id = $8`
    await db.query(sql, [
      title,
      dec,
      price,
      price_sale,
      imageName,
      videoName,
      category_id,
      id
    ])
    return res.status(200).json({ message : 'แก้ไขสำเร็จ'})

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};
