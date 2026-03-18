import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



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

    }).select("+password")

     res.status(201).json({
            message:"user registered Successfully",
            user
            
        })
    } catch (error) {
        res.status(500).json({
      success: false,
      message: "Server error"
        })
     console.log(error);
    }


}