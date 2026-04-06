import { Router } from "express";
import  { getMeController, loginController, registerController, verifyEmailController, logoutController } from "../controller/auth.controller.js";
import { validateMiddleware } from "../middleware/user.validate.js";
import { loginUserValidator, registerUserValidator } from "../validators/auth.validate.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

// register route
authRouter.post("/register", registerUserValidator, registerController)
// verify email route
authRouter.get("/verify-email", verifyEmailController)
// login route
authRouter.post("/login", loginUserValidator, loginController)
// getme route
authRouter.get("/get-me", authUserMiddleware, getMeController)
// logout route
authRouter.post("/logout", authUserMiddleware, logoutController)

export default authRouter;