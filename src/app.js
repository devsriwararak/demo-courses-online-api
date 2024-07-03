import express from 'express'
import cors from 'cors'

// Import Router
import userRoute from './routes/users.js'
import registerRoute from './routes/register.js'
import loginRouter from './routes/login.js'

const app = express()
app.use(cors())
app.use(express.json());

app.get('/', (req,res)=> {
    res.send('v1')
})


// Routers
app.use('/api/users', userRoute)
app.use('/api/register', registerRoute)
app.use('/api/login', loginRouter)

export default app