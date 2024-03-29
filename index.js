const express = require("express")
require('dotenv').config()
const app = express()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const {connect} = require("./config/db")
const {AdminModel} = require("./models/admin.model")
const {authenticate_admin,authenticate_user} = require("./middleware/authentication")
const {hotelRouter} = require("./routes/hotel.route")
const {HotelModel} = require("./models/hotel.model")
const {UserModel} = require("./models/user.model")

const {paymentRouter} = require('./routes/payment.route')

app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.get("/",(req,res)=>{
    res.send("welcome")
})

app.get("/hotels",async(req,res)=>{
    const data = await HotelModel.find()
    res.send(data)
})

//get by city
app.get("/search",async(req,res)=>{
    const q = req.query
    console.log(q)
    //res.send(q)
    try{
        let data = await HotelModel.find({"city":{$regex: '^' + q.city, $options: 'i'}})
        console.log("done")
        res.send(data)
    }
    catch(err){
        res.send(err)
    }
})

app.use("/payment",paymentRouter)

app.post("/admin/signup", async(req,res)=>{
    const {name,email,password,isadmin} = req.body;
    const userpresent = await AdminModel.findOne({email})

    if(userpresent?.email){
        res.send("signup with new email")
    }
    else{
        try{
            bcrypt.hash(password, 5, async function(err, hash) {
                const user = new AdminModel({name,email,password:hash,isadmin})
                await user.save();
                res.send("signup successful")
            });
        }
        catch(err){
            res.send(err)
        }
    }

})

app.post("/admin/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await AdminModel.find({email});
        if(user.length > 0){
            const hash_pass = user[0].password; 
            bcrypt.compare(password, hash_pass, function(err, result) {
                //console.log(result)
                if(result){
                    const token = jwt.sign({"userid":user[0]._id}, 'shhhhh');
                    res.send({"msg":"Login successfull","token" : token})
                }
                else{
                    res.send("login failed")
                }
            });
        }
        else{
            res.send("no user")
        }
    }
    catch(err){
        res.send(err)
    }
})

app.post("/user/signup", async(req,res)=>{
    const {name,email,password,phone} = req.body;
    const userpresent = await UserModel.findOne({email})

    if(userpresent?.email){
        res.send("signup with new email")
    }
    else{
        try{
            bcrypt.hash(password, 5, async function(err, hash) {
                const user = new UserModel({name,email,password:hash,phone})
                await user.save();
                res.send("signup successful")
            });
        }
        catch(err){
            res.send(err)
        }
    }

})

app.post("/user/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await UserModel.find({email});
        if(user.length > 0){
            const hash_pass = user[0].password; 
            bcrypt.compare(password, hash_pass, function(err, result) {
                //console.log(result)
                if(result){
                    const token = jwt.sign({"userid":user[0]._id}, 'shhhhh');
                    res.send({"msg":"Login successfull","token" : token})
                }
                else{
                    res.send("login failed")
                }
            });
        }
        else{
            res.send("no user")
        }
    }
    catch(err){
        res.send(err)
    }
})

app.use(authenticate_admin);
app.use("/admin/hotel", hotelRouter)

app.listen(9050,async()=>{
    try{
        await connect
        console.log("hotel server")
    }
    catch(err){
        console.log(err)
    }
    
})