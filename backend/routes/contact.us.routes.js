const express = require("express")
const router = express.Router();
const path = require("path");
const contactController = require('../controller/contact.controller')
// router.get('/contactus',(req,res)=>{
//     res.json({
//         success : true,
//         message : 'welcome to contact us'
//     })
// })
router.post("/feedback",contactController.feedback)
module.exports = router;