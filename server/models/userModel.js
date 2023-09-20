const mongoose =  require('mongoose');

const userScheme =  new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:[
            true,'Please add emailId'
        ],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        require:[true,'please add password'],
        min:6,
        max:64,
    },
    role:{
        type:String,
        default:'user',
    }

},{
    timestamps:true
});


module.exports = mongoose.model("UserModel",userScheme)