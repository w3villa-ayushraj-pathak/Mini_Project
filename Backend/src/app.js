const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const authroute=require('./routes/auth.route')
const errorMiddleware=require('./middlewares/error.middleware')
const profileRoute=require('./routes/profile.route')
const planRoute=require('./routes/plan.route')
const paymentRoute=require('./routes/payment.route')
const adminRoute=require('../src/routes/admin.route')
const courseRoute=require('./routes/course.route')
const mapRoute=require('./routes/map.route')


const app=express()


app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authroute)
app.use('/api/profile',profileRoute)
app.use("/api/plans", planRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/admin",adminRoute)
app.use('/api/course',courseRoute)
app.use('/api/map',mapRoute)


module.exports=app