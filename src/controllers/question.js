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
    const sql = `INSERT INTO question (question, index, products_id ) VALUES ($1,$2,$3)`;
    await db.query(sql, [question, index, products_id]);
    return res.status(200).json({ message: "บันทึกสำเร็จ" });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

// GET ALL
export const getAllQuestion = async (req, res) => {
  const { search, full } = req.body;
  console.log(search);
  const db = await pool.connect();
  try {
    // paginations
    const page = parseInt(req.body.page) || 1;
    // const sqlPage = `SELECT COUNT(id) FROM question`;
    let sqlPage = `
    SELECT  
        COUNT(question.id) as count
    FROM question 
        JOIN products ON products.id = question.products_id
        GROUP BY question.products_id, products.title ORDER BY question.products_id
    `;
    const resultPage = await db.query(sqlPage);

    const limit = full ? resultPage.rows.length : 3;
    const offset = (page - 1) * limit;
    const totalItems = parseInt(resultPage.rows.length);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = `
    SELECT  
        question.products_id,
        products.title,
        COUNT(question.id) as count
    FROM question 
        JOIN products ON products.id = question.products_id
    `;

    const params = [limit, offset];
    if (search) {
      sql += ` WHERE products.title LIKE $3`;
      params.push(`%${search}%`);
    }

    sql += ` GROUP BY question.products_id, products.title ORDER BY question.products_id  LIMIT $1 OFFSET $2`;

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
// เช็คข้อที่
export const getCheckQuestion = async (req, res) => {
  const { id } = req.params;
  const db = await pool.connect();
  try {
    const sql = `SELECT COUNT(id) as count FROM question WHERE products_id = $1 `;
    const result = await db.query(sql, [id]);
    return res.status(200).json(parseInt(result.rows[0].count) + 1);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

// GET LIST
export const getQuestionList = async (req, res) => {
  const { search, products_id, full } = req.body;
  const db = await pool.connect();
  try {
    if (!products_id)
      return res.status(400).json({ message: "ส่งข้อมูลไม่ครบ xxxxx" });

    // paginations
    const page = parseInt(req.body.page) || 1;
    const sqlPage = `SELECT COUNT(id) FROM question WHERE products_id = $1`;
    const resultPage = await db.query(sqlPage, [products_id]);
    const limit = full ? resultPage.rows[0].count : 3;
    const offset = (page - 1) * limit;
    const totalItems = parseInt(resultPage.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    let sql = ` SELECT id, question, index FROM question WHERE products_id = $1`;

    const params = [products_id, limit, offset];
    if (search) {
      sql += ` AND question LIKE $4`;
      params.push(`%${search}%`);
    }

    sql += ` ORDER BY  index ASC  LIMIT $2 OFFSET $3`;

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

// GET LIST BY ID
export const getQuestionListById = async (req, res) => {
  const { id } = req.params;
  console.log("555555555");
  const db = await pool.connect();

  try {
    const sql = `SELECT id, question, index, products_id FROM question WHERE id = $1 `;
    const result = await db.query(sql, [id]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

// Edit LIST BY ID
export const editQuestionListById = async (req, res) => {
  const { id, question, products_id } = req.body;
  const db = await pool.connect();
  try {
    if (!id || !products_id)
      return res.status(400).json({ message: "ส่งข้อมูลไม่ครบ" });

    // check
    const sqlCheck = `SELECT id FROM question WHERE question = $1 AND id != $2 AND products_id = $3`;
    const resultCheck = await db.query(sqlCheck, [question, id, products_id]);
    if (resultCheck.rows.length > 0)
      return res.status(400).json({ message: "มีคำถามนี้แล้ว" });

    // บันทึก
    const sql = `UPDATE question SET question = $1 WHERE id = $2`
    await db.query(sql, [question, id])
    return res.status(200).json({message : 'บันทึกสำเร็จ'})

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  } finally {
    db.release();
  }
};

// DELETE LIST BY ID
export const deleteQuestionListById = async(req,res)=> {
  const {id} = req.params
  const db = await pool.connect()
  try {
    const sql = `DELETE FROM question WHERE id = $1`
    await db.query(sql, [id])
    return res.status(200).json({message : 'ลบสำเร็จ'})
    
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message)
  } finally {
    db.release()
  }
}

// ลากเปลี่ยนข้อ
export const changIndex = async(req,res)=> {
  const {arrData, page} = req.body
  const db = await pool.connect()
  try {
    const limit = 3
    const offset = (page - 1) * limit;
    const newData = arrData.map((item, index) => ({
      id: item.id,
      index: offset + index + 1
    }));

    const sql = `UPDATE question SET index = $1 WHERE id = $2`
    for (const item of newData) {
      await db.query(sql, [item.index, item.id])
    }
    return res.status(200).json({message : 'เปลี่ยนตำแหน่งสำเร็จ'})

  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message)
  } finally {
    db.release()
  }
}
