import {Router} from "express"
import { sendMessage } from "../controller/chat.controller.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

const chatRouter = Router();
// post sendmessage
chatRouter.post("/message",authUserMiddleware, sendMessage)


export default chatRouter;