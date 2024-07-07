import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { getAllQuestion, getCheckQuestion, postNewQuestion } from '../controllers/question.js'

const router = express.Router()

router.post('/', authenticationToken, getAllQuestion)
router.post('/add', authenticationToken, postNewQuestion)
router.get('/check_index/:id', authenticationToken, getCheckQuestion)
export default router