const express = require ('express');
const cors =  require('cors');
const dotenv= require('dotenv');
const colors = require('colors');
const morgan =  require('morgan');
const exp = require('constants');
const connectDB = require('./config/db');

dotenv.config();
//db connection 
connectDB();


//rest obj
const app =express() 
//middelware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth',require("./routes/userRoutes"));

app.get('/',(req,res)=>{
    res.status(200).send({
        "success":true,
        "message":"node runing"
        
    })
});

//Port Number

const PORT = process.env.PORT ||  8080;

//listen

app.listen(PORT,()=>{
    console.log(`server Rinning ${PORT}`.bgGreen.white);
})