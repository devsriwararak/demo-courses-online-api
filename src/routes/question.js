import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewQuestion, countQuestion, deleteQuestionListById, editQuestionListById, getAllQuestion, getCheckQuestion, getNewQuestion, getQuestionList, getQuestionListById, postNewQuestion, selectCourses } from '../controllers/question.js'

const router = express.Router()

router.post('/', authenticationToken, getAllQuestion)
router.post('/add', authenticationToken, postNewQuestion)
router.get('/check_index/:id', authenticationToken, getCheckQuestion)

// Question List
router.post('/list', authenticationToken, getQuestionList)
router.get('/list/:id', authenticationToken, getQuestionListById)
router.put('/list', authenticationToken , editQuestionListById)
router.delete('/list/:id', authenticationToken, deleteQuestionListById)
// router.post('/list/change', authenticationToken, changIndex)

// SELECT
router.get('/select/courses/:id', authenticationToken, selectCourses)

// new
router.get('/new/count', authenticationToken, countQuestion)
router.post('/new', authenticationToken, getNewQuestion)
router.post('/new/add', authenticationToken, addNewQuestion)



export default router