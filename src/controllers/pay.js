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
