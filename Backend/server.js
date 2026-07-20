require('dotenv').config()
const app=require('./src/app')
const connectDb=require('./src/config/db')
const expiredPlan=require('./src/jobs/expiredPlan.job')

app.listen(3000,()=>{
    console.log('server is listening at 3000')
})


connectDb()
expiredPlan()