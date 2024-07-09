import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { changIndex, deleteQuestionListById, editQuestionListById, getAllQuestion, getCheckQuestion, getQuestionList, getQuestionListById, postNewQuestion } from '../controllers/question.js'

const router = express.Router()

router.post('/', authenticationToken, getAllQuestion)
router.post('/add', authenticationToken, postNewQuestion)
router.get('/check_index/:id', authenticationToken, getCheckQuestion)

// Question List
router.post('/list', authenticationToken, getQuestionList)
router.get('/list/:id', authenticationToken, getQuestionListById)
router.put('/list', authenticationToken , editQuestionListById)
router.delete('/list/:id', authenticationToken, deleteQuestionListById)
router.post('/list/change', authenticationToken, changIndex)


export default router