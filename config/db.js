const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
     const connect = await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser:true,
         useUnifiedTopology: true,
         useFindAndModify: false
     })
     console.log(`Mongodb is Connected: ${connect.connection.host}`)
    }
    catch(err){
        console.log()
        process.exit(1)
    }
}

module.exports = connectDB