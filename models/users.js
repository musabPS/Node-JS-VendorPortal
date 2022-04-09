const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(value.length<7){
                throw new Error("Password must be 7 characters long")
            }
        }
    }
   
})

const user = mongoose.model('Product', userSchema)

module.exports = user