import express from 'express'
import { authenticationToken } from '../middleware/auth.js'
import { addNewProduct, addNewProductsVideos, addNewProductTitle, deleteProductById, deleteProductTitle, deleteProductVideoById, editProductByid, editProductsVideos, getAllProducts, getAllProductsTitle, getAllProductsVideos, getProductById, getProductsTitleById, getProductsVideosById, putProductsTitle, uploadMiddleware } from '../controllers/products.js'

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

// Products Videos
routes.post('/add/videos', authenticationToken, uploadMiddleware , addNewProductsVideos)
routes.post('/videos', authenticationToken, getAllProductsVideos)
routes.get('/videos/:id', authenticationToken, getProductsVideosById)
routes.put('/videos', authenticationToken, uploadMiddleware,  editProductsVideos)
routes.delete('/videos/:id' ,authenticationToken, deleteProductVideoById)


export default routes