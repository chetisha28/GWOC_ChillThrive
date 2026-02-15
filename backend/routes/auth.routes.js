const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

router.get('/',(req,res)=>{
    res.json({
        message : "WELCOME TO CHILL THRIVE AUTH ROUTE",
        endpoints : {
            register : "POST /api/auth/register",
            login : "POST /api/auth/login"
        }
    })
})
// router.get("/register",(req,res)=>{
//     res.render("index")
// })
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;