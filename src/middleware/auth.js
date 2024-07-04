import jwt from 'jsonwebtoken'

const jwtSecret = "smalldick_bigheart";

export const authenticationToken  = (req,res, next)  => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.status(400).json({message: 'ไม่มี Token'})

        jwt.verify(token, jwtSecret, (err, user)=> {
            if(err) return res.status(400).json({message : 'token ไม่ถูกต้อง'})
                req.user = user
            next()
        })

}