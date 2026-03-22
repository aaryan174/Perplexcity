import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true, "username must be filled"],
        unique:[true, "username must be unique"]
    },
    email:{
        type:String,
        required:[true, "email must be filled"],
        unique:[true, "email must be unique"]  
    },
    password:{
        type:String,
        required: true,
        select: false
    },
    verified:{
        type:Boolean,
        default: false
    }
}, {timestamps: true});

const userModel = mongoose.model("user", userSchema);

export default userModel;