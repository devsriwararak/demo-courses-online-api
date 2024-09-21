import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { getAllPay, payNewCourses } from '../controllers/pay.js'
const router = express.Router()

router.post('/', authenticationToken, getAllPay)
router.post('/add', authenticationToken, payNewCourses)

export default router