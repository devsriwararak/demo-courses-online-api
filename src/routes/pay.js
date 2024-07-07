import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { getAllPay } from '../controllers/pay.js'
const router = express.Router()

router.post('/', authenticationToken, getAllPay)

export default router