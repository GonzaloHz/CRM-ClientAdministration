const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' })

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_MONGO)
        console.log("DB connected")
    }catch(err){
        console.log("There is an error")
        console.log(err)
        process.exit(1); //To stop the app
    }
}

module.exports = connectDB;