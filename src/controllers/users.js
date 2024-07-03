import pool from "../db/index.js";

// เขียนแบบนี้ได้ไหม หรือมีวิธีที่ดีกว่านี้
export const getAllUsers = async(req,res)=> {
    const db = await pool.connect()
    try {
        const sql = `SELECT * FROM users`
        const result = await db.query(sql)
        res.status(200).json(result.rows)
        
    } catch (error) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Server error');
    }finally {
        db.release()
    }
}