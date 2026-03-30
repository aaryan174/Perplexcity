import {Router} from "express"
import { deleteChat, getChats, getMessages, sendMessage } from "../controller/chat.controller.js";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

const chatRouter = Router();
// post sendmessage
chatRouter.post("/message",authUserMiddleware, sendMessage);
// getchats
chatRouter.get("/", authUserMiddleware, getChats)
// get message
chatRouter.get("/:chatId/messages", authUserMiddleware, getMessages)
// delete chat
chatRouter.delete("/delete/:chatId", authUserMiddleware, deleteChat)


export default chatRouter;