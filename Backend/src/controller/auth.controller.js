import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// register controller
 export async function registerController(req, res) {
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
// login controller
export async function loginController(req, res) {
  try {
    const {identifier, password} = req.body;
    const user = await userModel.findOne({
        $or:[
            {username: identifier},
            {email: identifier}
        ]
    }).select("+password")             
    

    if(!user){
        return res.status(400).json({
            message:"Invalid email or Password",
            success: false,
            err: "Invalid email or Password"
        })
    }

    const isPasswordhashed = await bcrypt.compare(password, user.password)

    if(!isPasswordhashed){
        return res.status(400).json({
            message:"Invalid email or Password",
            success: false,
            err:"Invalid email or Password"
        })
    }

    const token = await jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    }, process.env.TOKEN, { expiresIn: "2d" })

    res.cookie("token", token)

    res.status(200).json({
        message:"user logged in Successfully",
        success: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}
// get-me
export async function getMeController(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId)

    if(!user){
        return res.status(400).json({
            message:"User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "user detail fetched Successfully",
        user
    })
}

// logout controller
export async function logoutController(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "user logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}