import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/mail.service.js";


// register controller
async function registerController(req, res) {
    try {
        const {username, email, password} = req.body;

    const isuserAlreadyexists = await userModel.findOne({
         $or: [
            { username },
            { email }
        ]
    })
    if(isuserAlreadyexists){
        return res.status(409).json({
            message:"User Already exists",
            success: false
        })
    }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
        username, email, password: hashPassword
    })

    const emailverficationToken = jwt.sign({
        email: user.email
    }, process.env.TOKEN)
    

    await sendEmail({
        to: email,
        subject: "welcome to Perplexcity!",
        // html: <p>`Hi<b>${username}</b>,\n\nThank you for registering at Perplexcity. We're excited to have you on board!\n\n Best regards,\n The Perplexcity Team`</p>
        html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      
      <h2 style="color: #4CAF50;">Welcome to Perplexcity 🎉</h2>
      
      <p>
        Hi <b>${username}</b>,
      </p>
      
      <p>
        Thank you for registering at <b>Perplexcity</b>. We're excited to have you on board! Please verify your email address by clicking the link below:
      </p>

      <a href="http://localhost:3000/api/auth/verify-email?token=${emailverficationToken}">Verify Email </a>
      
      <p>
        Get ready to explore amazing features and have a great experience 🚀
      </p>
      
      <br/>
      
      <p>
        Best regards,<br/>
        <b>The Perplexcity Team</b>
      </p>

    </div>`
    })

     res.status(201).json({
            message:"user registered Successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
            
        })
    } catch (error) {
        res.status(500).json({
      success: false,
      message: "Server error"
        })
     console.log(error);
    }


}

// async function verifyEmailController(params) {
//     const 
// }

export default registerController