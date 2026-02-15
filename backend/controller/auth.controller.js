const authService = require('../services/auth.service');
const nodemailer = require('nodemailer')
//email server linking
const transporter = nodemailer.createTransport({
  service : 'gmail',
  auth: {
    user: 'chillthrive557@gmail.com',
    pass: 'ioztvzipyieurxdf'
  },
});
//email sending
const sendRegisterEmail = async(body)=>{
    console.log(body.email);
    const userName = body.username || body.name || 'Customer';
    const userEmail = body.email;
    await transporter.sendMail({
      from: 'chillthrive557@gmail.com',
      to: userEmail,
      subject: 'Registration Confirmation - Chill Thrive',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #667eea;">✅ Registration Confirmed!</h2>
          
          <p>Dear ${userName},</p>
          <p>Thank you for Registering on <strong>Chill Thrive</strong>!</p>
          
          
          <p>We'll contact you soon to confirm your booking.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Chill Thrive Team</strong>
          </p>
       </div>
      `
    });

}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // validation
        if (!name || !email || !password) {
             return res.status(400).json({
             success: false,
             message: "All fields are required"
            });
        }
        const result = await authService.registerUser(name, email, password);
        sendRegisterEmail(req.body).catch(err => {
            console.error('Email sending failed:', err);
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role
            },
            token: result.token
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        // validation
        if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
        const result = await authService.loginUser(email, password);
        if (!result.success) {
            return res.status(401).json({ success: false, message: result.message });
        }
        res.send({ 
            success: true,
            message: 'Login successful', 
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role
            },
            token: result.token
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
