import express from 'express'
import { loginUser, loginUserOtp } from '../controllers/login.js'

const router = express.Router()

router.post('/', loginUser)
router.post('/otp', loginUserOtp)

export default router