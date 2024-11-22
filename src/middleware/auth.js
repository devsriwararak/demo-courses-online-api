import jwt from "jsonwebtoken";
import pool from "../db/index.js";


const jwtSecret = process.env.JWT_SECRET;

// export const authenticationToken  = async (req,res, next)  => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if(token == null) return res.status(400).json({message: 'ไม่มี Token'})

//         jwt.verify(token, jwtSecret, (err, user)=> {
//             if(err) return res.status(400).json({message : 'token ไม่ถูกต้อง'})
//                 req.user = user

//             next()
//         })

// }

export const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const db = await pool.connect();


  try {
    if (token == null) return res.status(400).json({ message: "ไม่มี Token" });

    // Check token ที่ส่งมา กับ DB 
    const sqlCheck = `SELECT id FROM users WHERE token = $1`
    const resultCheck = await db.query(sqlCheck, [token]) 
    console.log({resultCheck: resultCheck.rows});
    
    if(!resultCheck.rows.length) return res.status(400).json({message : 'Token ไม่ตรงกับระบบ'})

        console.log('test000');
        

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) return res.status(400).json({ message: "token ไม่ถูกต้อง" });
      req.user = user;

      next();
    });
  } catch (error) {
    console.log(error);
  } finally {
    db.release()
  }
};
