import mongoose from "mongoose";



const ConnectToDb = async ()=>{
  await mongoose.connect(process.env.MONGO_URI)
    console.log("database connected Successfully")
}



export default ConnectToDb;