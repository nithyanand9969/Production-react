const mongoose =  require('mongoose');
const colors = require('colors');


const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(  `connected ${mongoose.connection.host}`.bgBlack.white);
    } catch (error) {
        console.log(`Err on connecton ${error}`.bgBlack.white);
        
    }

}

module.exports = connectDB;