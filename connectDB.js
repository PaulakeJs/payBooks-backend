const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        mongoose.set('strictQuery',false)
        const conn = await mongoose.connect('mongodb+srv://paulake:paulake@cluster0.edempvs.mongodb.net/Books?retryWrites=true&w=majority')
        console.log(`database connected ${conn.connection.host}`)
    } catch (error) {
    process.exit(1)
    }
}

module.exports = connectDB