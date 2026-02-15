const mongoose = require("mongoose");

const serviceDetail = new mongoose.Schema({
    name:{
        type : String,
        required :true,
        unique : true
    },
    price : {
        type : String,
        required : true
    },
    isActive : {
        type:Boolean,
        default:true
    },
    category:{
        type:String,
        required:true,
        enum : ["ice bath","jacuzzi","steam bath"]
    }
},{timestamps:true})
module.exports = mongoose.model("Services",serviceDetail);