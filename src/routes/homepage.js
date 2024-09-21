import express from 'express'
import { getCategory, getEbook, getNewCourses, getNewCoursesById, getNews, getNewsById } from '../controllers/homepage.js'
const router = express.Router()

router.post('/courses', getNewCourses)
router.get('/courses/:id', getNewCoursesById)

router.post('/news', getNews)
router.get('/news/:id', getNewsById)
// Category
router.get('/category', getCategory)
// Ebook
router.post('/ebook', getEbook)



export default router