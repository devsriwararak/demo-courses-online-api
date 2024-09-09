import pool from "../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = await pool.connect();
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "ส่งข้อมูลมาไม่ครบ" });
    }
    // เช็คความถูกต้อง
    const sql = `SELECT id, username, password, status FROM users WHERE username = $1`;
    const result = await db.query(sql, [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้งานไม่ถูกต้อง" });
    }
    // เช็ค password ตรงกันไหม
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // OK
    const token = jwt.sign(
      { id: user.id, username: user.username, status: user.status },
      jwtSecret,
      { expiresIn: "1d" }
    );
    return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const loginUserOtp = async (req, res) => {
  const { id, otp } = req.body;
  const db = await pool.connect();
  try {
    if (!id || !otp) return res.status(400).json({ message: "ไม่พบข้อมูล" });

    // check otp
    const sqlCheck = `SELECT id, username, status FROM users WHERE id = $1 AND otp = $2`;
    const resultCheck = await db.query(sqlCheck, [id, otp]);
    if (resultCheck.rows.length <= 0)
      return res.status(400).json({ message: "Token ไม่ตรงกัน" });

    const user = resultCheck.rows[0];

    // OK
    const token = jwt.sign(
      { id: user.id, username: user.username, status: user.status },
      jwtSecret,
      { expiresIn: "1d" }
    );
    return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};
