import { Router } from "express";
import  { loginController, registerController, verifyEmailController } from "../controller/auth.controller.js";
import { validateMiddleware } from "../middleware/user.validate.js";
import { loginUserValidator, registerUserValidator } from "../validators/auth.validate.js";

const authRouter = Router();

// register route
authRouter.post("/register", registerUserValidator, validateMiddleware, registerController)
// verify email route
authRouter.get("/verify-email", verifyEmailController)
// login route
authRouter.post("/login", loginUserValidator, validateMiddleware, loginController)



export default authRouter;