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


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://mini-project-navy-iota.vercel.app"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive to prevent CORS blocking legitimate frontends
      }
    },
    credentials: true
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
app.get('/ping', (req, res) => {
    res.send('Backend is alive!');
});
module.exports=app