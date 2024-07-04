import pool from "../db/index.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const { username, password, name,  status } = req.body;
  const db = await pool.connect();
  try {
    if (!username || !password || typeof status === "undefined") {
      // ทำไมส่งข้อมูลมา status : 0 เข้าเงื่อนไขนี้
      return res.status(400).json({ message: "ส่งข้อมูลไม่ครบบบ" });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const sqlCheck = `SELECT id FROM users WHERE username = $1`;
    const resultCheck = await db.query(sqlCheck, [username]);
    if (resultCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "มีผู้ใช้งานนี้แล้ว กรุณาสมัครใหม่" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่ม ฐานข้อมูล
    const sql = `INSERT INTO users (username , password, name, status) VALUES ($1,$2,$3,$4) RETURNING *`;
    await db.query(sql, [username, hashedPassword, name, status]);
    return res.status(200).json({ message: "สมัครสมาชิกสำเร็จ" });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};
