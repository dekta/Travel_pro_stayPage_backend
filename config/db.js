const mongoose = require("mongoose")
require('dotenv').config()
const {connect} = mongoose.connect("mongodb+srv://nikki:nikki@cluster0.6e1hgzl.mongodb.net/hoteldata?retryWrites=true&w=majority")

module.exports = {connect}