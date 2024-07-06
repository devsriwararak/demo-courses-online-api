import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewProduct, getAllProducts, uploadMiddleware } from '../controllers/products.js'

const  routes = express.Router()

routes.post('/add', authenticationToken, uploadMiddleware, addNewProduct)
routes.post('/', authenticationToken , getAllProducts)

export default routes