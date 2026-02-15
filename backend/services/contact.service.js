const contactDetails = require("../models/contactus.model");

exports.sendFeedback = async(name,email,message)=>{
    return contactDetails.create({
        name,
        email,
        message
    })
}