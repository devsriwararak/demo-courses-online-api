import moment from "moment";
import pool from "../db/index.js";

export const getAllPay = async (req, res) => {
  const { search } = req.body;
  const db = await pool.connect();
  try {
    // paginations
    const page = parseInt(req.body.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;
    const sqlPage = `SELECT COUNT(id) FROM pay`;
    const resultPage = await db.query(sqlPage);
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = `
    SELECT 
    pay.id, 
    pay.code , 
    TO_CHAR(pay.start_pay , 'DD-MM-YYYY') as start_pay , 
    TO_CHAR(pay.end_pay , 'DD-MM-YYYY') as end_pay, 
    pay.status, 
    users.name , 
    products.title
    FROM pay
    JOIN users ON users.id = pay.users_id
    JOIN products ON products.id = pay.products_id
    `;

    const params = [limit, offset];
    if (search) {
      sql += ` WHERE pay.code LIKE $3`;
      params.push(`%${search}%`);
    }

    sql += ` LIMIT $1 OFFSET $2 `;

    const result = await db.query(sql, params);
    console.log(result.rows);
    return res.status(200).json({
      page,
      limit,
      totalPages,
      totalItems,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

export const payNewCourses = async (req, res) => {
  const { users_id, id } = req.body;
  const products_id = id;
  const db = await pool.connect();
  console.log(req.body);

  try {
    // เริ่ม transaction เพื่อความปลอดภัย
    // await db.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");

    // ตรวจสอบว่าผู้ใช้เคยซื้อหรือไม่
    const sqlCheck = `SELECT id, start_pay, end_pay FROM pay WHERE users_id = $1 AND products_id = $2 ORDER BY id DESC LIMIT 1`;
    const resultCheck = await db.query(sqlCheck, [users_id, products_id]);

    if (resultCheck.rowCount > 0) {
      
      //ถ้าเคยซื้อเช็คว่า คอร์สหมดอายุยัง
      const courseEndDate = moment(resultCheck.rows[0].end_pay).format("YYYY-MM-DD");
      const dateNow = moment().format("YYYY-MM-DD");
      // console.log({courseEndDate, dateNow});
      
      // ตรวจสอบว่าคอร์สหมดอายุหรือยัง
      if (courseEndDate >= dateNow) {
        
        // ถ้าคอร์สยังไม่หมดอายุ ไม่อนุญาตให้ซื้อใหม่
        return res.status(400).json({
          message: "คอร์สยังไม่หมดอายุ ไม่อนุญาตให้ซื้อใหม่",
        });
      } 
    }

    // ซื้อคอร์สเรียนได้

    // วันที่เริ่มและสิ้นสุดการซื้อ
    const dateNow = moment().format("YYYY-MM-DD");
    const nextYearDate = moment().add(1, "year").format("YYYY-MM-DD");
    const currentYear = new Date().getFullYear();

    // Query หาบิลล่าสุดที่ตรงกับปีปัจจุบัน
    const result = await db.query(
      "SELECT code FROM pay WHERE code LIKE $1 ORDER BY id DESC LIMIT 1",
      [`N${currentYear}-%`]
    );

    let newBillNumber = `N${currentYear}-00001`; // ถ้ายังไม่มีบิลในปีนี้

    if (result.rows.length > 0) {
      // ดึงเลขบิลล่าสุดที่เจอ เช่น N2024-0001
      const lastBillNumber = result.rows[0].code;
      const lastNumber = parseInt(lastBillNumber.split("-")[1]); // "0001"

      // เพิ่ม 1 เพื่อสร้างเลขบิลใหม่
      const newNumber = (lastNumber + 1).toString().padStart(5, "0"); // ใช้ 5 หลัก
      newBillNumber = `N${currentYear}-${newNumber}`; // เช่น N2024-0002
    }

    // บันทึกบิลใหม่
    await db.query(
      "INSERT INTO pay (code, start_pay, end_pay, users_id, products_id) VALUES ($1, $2, $3, $4, $5)",
      [newBillNumber, dateNow, nextYearDate, users_id, products_id]
    );

    // Commit การทำงานทั้งหมด

    // await db.query("COMMIT");

    return res
      .status(200)
      .json({ message: "บันทึกสำเร็จ", bill_number: newBillNumber });
  } catch (error) {
    // Rollback ถ้าเกิดปัญหา
    await db.query("ROLLBACK");
    console.log(error);
    return res.status(500).json({ error: error.message });
  } finally {
    db.release();
  }
};
