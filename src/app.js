import express from 'express'
import cors from 'cors'

// Import Router
import userRoute from './routes/users.js'
import registerRoute from './routes/register.js'
import loginRouter from './routes/login.js'
import adminRouter from './routes/admin.js'
import categoryRouter from './routes/category.js'
import productRouter from './routes/products.js'
import payRouter from "./routes/pay.js"
import questionRouter from "./routes/question.js"
import reviewsRouter from './routes/reviews.js'
import activityRouter from './routes/activity.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' })); // เพิ่ม limit สำหรับ payload
app.use(express.urlencoded({ extended: true }));
app.get('/', (req,res)=> {
    res.send('v1ss')
})


// Routers
app.use('/api/users', userRoute)
app.use('/api/register', registerRoute)
app.use('/api/login', loginRouter)
app.use('/api/admin', adminRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/pay', payRouter)
app.use('/api/question', questionRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/activity', activityRouter)

export default app