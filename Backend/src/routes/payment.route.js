const express=require('express')
const {createOrder,verifyPayment,getPaymentHistory}=require('../controllers/payment.controller')
const protect=require('../middlewares/auth.middleware')

const router=express.Router()

router.use(protect)

router.post('/create-order',createOrder)
router.post('/verify-payment',verifyPayment)
router.get('/history',getPaymentHistory)

module.exports=router
