const mongoose=require('mongoose')

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to Database')
    }
    catch(err)
    {
        console.log('Error while connecting to Database',err)
    }
}

module.exports=connectDb