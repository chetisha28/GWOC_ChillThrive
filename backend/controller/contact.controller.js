const contactService = require("../services/contact.service");

exports.feedback = async(req,res)=>{
    await contactService.sendFeedback(req.body.name,req.body.email,req.body.message);
    res.send({
        success : true,
        message : "FEEDBACK SEND SUCCESSFULLY"
    })
}