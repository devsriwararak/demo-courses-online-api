import express from 'express'
import cors from 'cors'

// Import Router
import userRoute from './routes/users.js'
import registerRoute from './routes/register.js'
import loginRouter from './routes/login.js'
import adminRouter from './routes/admin.js'
import categoryRouter from './routes/category.js'
import productRouter from './routes/products.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' })); // เพิ่ม limit สำหรับ payload

app.get('/', (req,res)=> {
    res.send('v12222')
})


// Routers
app.use('/api/users', userRoute)
app.use('/api/register', registerRoute)
app.use('/api/login', loginRouter)
app.use('/api/admin', adminRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)

export default app
