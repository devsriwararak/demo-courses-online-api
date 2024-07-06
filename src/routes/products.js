import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewProduct, deleteProductById, editProductByid, getAllProducts, getProductById, uploadMiddleware } from '../controllers/products.js'

const  routes = express.Router()

routes.post('/add', authenticationToken, uploadMiddleware, addNewProduct)
routes.post('/', authenticationToken , getAllProducts)
routes.get('/:id', authenticationToken, getProductById)
routes.delete('/:id', authenticationToken, deleteProductById)
routes.put('/', uploadMiddleware, authenticationToken , editProductByid)

export default routes