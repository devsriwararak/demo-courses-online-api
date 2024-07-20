import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewProduct, addNewProductTitle, deleteProductById, deleteProductTitle, editProductByid, getAllProducts, getAllProductsTitle, getProductById, getProductsTitleById, putProductsTitle, uploadMiddleware } from '../controllers/products.js'

const  routes = express.Router()

routes.post('/add', authenticationToken, uploadMiddleware, addNewProduct)
routes.post('/', authenticationToken , getAllProducts)

routes.get('/:id', authenticationToken, getProductById)
routes.delete('/:id', authenticationToken, deleteProductById)
routes.put('/', uploadMiddleware, authenticationToken , editProductByid)

// products_title
routes.post('/add/title', authenticationToken, addNewProductTitle)
routes.post('/title', authenticationToken, getAllProductsTitle)
routes.get('/title/:id' , authenticationToken, getProductsTitleById)
routes.put('/title', authenticationToken , putProductsTitle)
routes.delete('/title/:id', authenticationToken , deleteProductTitle)


export default routes