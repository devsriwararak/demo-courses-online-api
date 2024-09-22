import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { getAllPay, getPayMyUser, payNewCourses, updateCheckSlip, uploadMiddleware } from '../controllers/pay.js'
const router = express.Router()

router.post('/', authenticationToken, getAllPay)
router.post('/add', authenticationToken, payNewCourses)
router.post('/upload_slip', authenticationToken, uploadMiddleware, updateCheckSlip )
// User
router.post('/users', authenticationToken, getPayMyUser)



export default router