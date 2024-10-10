<<<<<<< HEAD
import express from 'express'
import { registerForgetPassword, registerUser } from '../controllers/register.js'

const router = express.Router()

router.post('/', registerUser)
router.post('/forget', registerForgetPassword )

=======
import express from 'express'
import { registerForgetPassword, registerUser } from '../controllers/register.js'

const router = express.Router()

router.post('/', registerUser)
router.post('/forget', registerForgetPassword )

>>>>>>> master
export default router