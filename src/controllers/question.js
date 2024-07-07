import pool from "../db/index.js";

export const postNewQuestion = async (req, res) => {
  const { question, index, products_id } = req.body;
  console.log(req.body);
  const db = await pool.connect();
  try {
    if (!question || !index || !products_id)
      return res.status(400).json({ message: "ส่งข้อมูลไม่ครบ" });

    // เช็คข้อมูลซ้ำ
    const sqlCheck = `SELECT id FROM question WHERE question = $1 `;
    const resultCheck = await db.query(sqlCheck, [question]);
    if (resultCheck.rows.length > 0)
      return res.status(400).json({ message: "มีคำถามนี้แล้ว" });

    // บันทึก
    const sql = `INSERT INTO question (question, index, products_id ) VALUES ($1,$2,$3)`
    await db.query(sql, [question, index, products_id])
    return res.status(200).json({message : 'บันทึกสำเร็จ'})

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

// GET ALL
export const getAllQuestion = async(req,res)=> {
    const {search, full} = req.body
    const db = await pool.connect()
    try {

          // paginations
    const page = parseInt(req.body.page) || 1;

    const sqlPage = `SELECT COUNT(id) FROM question`;
    const resultPage = await db.query(sqlPage);
    const limit = full ? resultPage.rows[0].count : 3 ;
    const offset = (page - 1) * limit;
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);


    let sql = `
    SELECT  
        products_id,
        title,
        COUNT(*) as count
    FROM question 
        JOIN products ON products.id = question.products_id
    `;

    const params = [limit, offset];
    if (search) {
      sql += ` WHERE title LIKE $3`;
      params.push(`%${search}%`);
    }

    sql += ` GROUP BY products_id, title ORDER BY products_id  LIMIT $1 OFFSET $2`;

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
        return res.status(500).json(error.message)
    } finally {
        db.release()
    }
}
// เช็คข้อที่
export const getCheckQuestion = async(req,res)=> {
    const {id} = req.params
    const db = await pool.connect()
    try {

        const sql = `SELECT COUNT(id) as count FROM question WHERE products_id = $1 `
        const result  = await db.query(sql, [id])
        return res.status(200).json(parseInt(result.rows[0].count) + 1)
        
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.message)
    } finally {
        db.release()
    }
}

