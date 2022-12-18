const mongoose = require("mongoose");

const userschema = mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:String,
    password:{type:String},
})


const UserModel = mongoose.model("user",userschema)

module.exports = {UserModel}