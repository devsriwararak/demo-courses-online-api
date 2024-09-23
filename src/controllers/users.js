import pool from "../db/index.js";

// เขียนแบบนี้ได้ไหม หรือมีวิธีที่ดีกว่านี้
export const getAllUsers = async (req, res) => {
  const db = await pool.connect();
  try {
    const sql = `SELECT * FROM users`;
    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Server error");
  } finally {
    db.release();
  }
};

export const getAllCategory = async (req, res) => {
  const { users_id } = req.body;

  const db = await pool.connect();
  try {
    if (!users_id)
      return res.status(400).json({ message: "ไม่พบข้อมูลผู้ใช้" });

    const sql = `SELECT DISTINCT  category.name as category_name , category.id as category_id
            FROM pay 
            JOIN products ON pay.products_id = products.id
            JOIN category ON products.category_id = category.id
            WHERE pay.users_id = $1
            `;
    const result = await db.query(sql, [users_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const getMyProduct = async (req, res) => {
  const { search, full, category_id , users_id} = req.body || "";
  const db = await pool.connect();

  try {
    // paginations
    const page = parseInt(req.body.page) || 1;
    const sqlPage = `SELECT COUNT(id) FROM pay WHERE users_id = $1`;
    const resultPage = await db.query(sqlPage, [users_id]);
    const limit = full ? resultPage.rows[0].count : 12;
    const offset = (page - 1) * limit;
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = `
    SELECT  products.id as products_id , products.title as products_title , products.dec as products_dec, products.price as products_price, products.price_sale as products_price_sale,
    products.image as products_image
    FROM pay
    LEFT JOIN products ON pay.products_id = products.id
    WHERE pay.users_id = $1 AND pay.status = 1
    `;
    const params = [users_id, limit, offset];

    if (search && category_id) {
      sql += ` AND products.title LIKE $4 AND products.category_id = $5`;
      params.push(`%${search}%`, category_id);
    } else if (search) {
      sql += ` AND products.title LIKE $4`;
      params.push(`%${search}%`);
    } else if (category_id ) {
      sql += ` AND products.category_id = $4`;
      params.push(category_id);
    }

    sql += ` LIMIT $2 OFFSET $3`;

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
