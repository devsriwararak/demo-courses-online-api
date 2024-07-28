import pool from "../db/index.js";
import multer from "multer";
import { uploadImageFile } from "../libs/uploadFile.js";
import { deleteImageFtp } from "../libs/ftpClient.js";
const upload = multer({ storage: multer.memoryStorage() });

// upload middleware
export const uploadMiddleware = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "album", maxCount: 10 },
]);

export const postNewReviews = async (req, res) => {
  const db = await pool.connect();
  const { type, title, dec } = req.body;
  const coverFile = req.files["cover"] ? req.files["cover"][0] : null;
  const albumFiles = req.files["album"];
  let fileName = "";
  let finenameArr = [];

  try {
    if (!type || !title || !dec || !coverFile)
      return res.status(400).json({ message: "ส่งข้อมูลไม่ครบ" });

    // เช็คข้อมูลซ้ำ
    const sqlCheck = `SELECT id FROM reviews WHERE title = $1`;
    const resultCheck = await db.query(sqlCheck, [title]);
    if (resultCheck.rows.length > 0)
      return res.status(400).json({ message: "มีข้อมูลนี้แล้ว" });

    if (coverFile) {
      fileName = await uploadImageFile(coverFile);
    }

    if (albumFiles) {
      for (const file of albumFiles) {
        const name = await uploadImageFile(file);
        finenameArr.push(name);
      }
    }

    // บันทึก
    const sql = `INSERT INTO reviews (title, dec, type, image_title) VALUES ($1,$2,$3,$4) RETURNING id`;
    const result = await db.query(sql, [title, dec, type, fileName]);
    const newId = result.rows[0].id;

    // บันทึก รูป arr
    const sqlArr = `INSERT INTO reviews_image (reviews_id, image) VALUES ($1, $2)  `;

    for (const fileName of finenameArr) {
      const albumValues = [newId, fileName];
      await db.query(sqlArr, albumValues);
    }

    return res.status(200).json({ message: "บันทึกสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const postALlReviews = async (req, res) => {
  const { search, full } = req.body;
  const db = await pool.connect();
  try {
    // paginations
    const page = parseInt(req.body.page) || 1;
    const sqlPage = `SELECT COUNT(id) FROM reviews`;
    const resultPage = await db.query(sqlPage);
    const limit = full ? resultPage.rows[0].count : 3;
    const offset = (page - 1) * limit;
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = `SELECT id, title, dec, image_title FROM reviews 
    `;
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

export const getReviewImageList = async (req, res) => {
  const { reviews_id } = req.params;
  const db = await pool.connect();

  try {
    const sql = `SELECT image FROM reviews_image WHERE reviews_id = $1`;
    const result = await db.query(sql, [reviews_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const getReviewsByid = async (req, res) => {
  const { id } = req.params;
  const db = await pool.connect();
  try {
    const sql = `SELECT id, title, dec, type, image_title FROM reviews WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const deleteReviewsById = async (req, res) => {
  const db = await pool.connect();
  const { id } = req.params;
  try {
    // เช็ครูปปก
    const sql = `SELECT id, image_title FROM reviews WHERE id = $1`;
    const result = await db.query(sql, [id]);

    // เช็ครูป รายการย่อย
    const sqlList = `SELECT image FROM reviews_image WHERE reviews_id = $1`;
    const resultList = await db.query(sqlList, [id]);
    // console.log(resultList.rows);

    const image_title = result.rows[0].image_title;
    // ลบรูป-หน้าปก
    if (image_title) {
      // await deleteImageFtp(`/images/${image_title}`); // ลบรูปเก่าก่อน
    }
    // ลบรูป-รายการ
    if (resultList.rows.length > 0) {
      for (const name of resultList.rows) {
        await deleteImageFtp(`/images/${name.image}`); // ลบรูปเก่าก่อน
      }
    }

    // ลบข้อมูล - หัว
    const sqlDelete = `DELETE FROM reviews WHERE id = $1`;
    await db.query(sqlDelete, [id]);
    // ลบข้อมูล - รายการ
    const sqlDeleteList = `DELETE FROM reviews_image WHERE reviews_id = $1`;
    await db.query(sqlDeleteList, [id]);
    return res.status(200).json({ message: "ลบสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const putReviews = async(req,res)=> {
    const {id, type, title, dec, cover, album} = req.body
    const db = await pool.connect()
    try {
        if(!id || !title)return res.status(400).json({message : 'ส่งข้อมูลไม่ครบ'})
            
        
        // เช็ครูป-หัว
        const sqlCheckHead = `SELECT image_title FROM reviews WHERE id = $1`
        const resultCheckHead = await db.query(sqlCheckHead, [id])

        let nameImage_title = resultCheckHead.rows[0].image_title
        if(resultCheckHead.rows[0].image_title !== cover){
            // ลบรูปเก่าก่อน
            nameImage_title = cover
        }

        // เช็ครูป-รายการ

        
    } catch (error) {
        console.error(error);
        return req.status(500).json(error.message)
    }finally {
        db.release()
    }
}