import express from 'express'
import { getAllCategory, getAllUsers } from '../controllers/users.js'
import { authenticationToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllUsers)
router.post('/category', authenticationToken , getAllCategory)

export default router