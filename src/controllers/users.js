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




