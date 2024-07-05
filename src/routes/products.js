import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewProduct, uploadMiddleware } from '../controllers/products.js'

const  routes = express.Router()

routes.post('/add', authenticationToken, uploadMiddleware, addNewProduct)

export default routes