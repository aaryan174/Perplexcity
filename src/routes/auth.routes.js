import { Router } from "express";
import  { registerController, verifyEmailController } from "../controller/auth.controller.js";

const authRouter = Router();


authRouter.post("/register", registerController)
authRouter.get("/verify-email", verifyEmailController)

export default authRouter;