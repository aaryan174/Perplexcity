import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";


export async function sendMessage(req, res) {
    try {
        const {message, chatId} = req.body;

        let title = null;
        let chat = null;

        if(chatId){
            chat = await chatModel.findById(chatId);
            if(!chat) {
                return res.status(404).json({ error: "Chat not found" });
            }
            title = chat.title;
        } else {
            try {
                title = await generateChatTitle(message);
            } catch(titleErr) {
                console.error("Failed to generate chat title:", titleErr.message);
                title = "New Chat";
            }
            chat = await chatModel.create({
                user: req.user.id,
                title
            })
        }
        const finalChatId = chatId || chat._id;

        const userMessage = await messageModel.create({
            chat: finalChatId,
            content: message,
            role: "user"
        })

        const messages = await messageModel.find({chat: finalChatId})

        const result = await generateResponse(message)

        const aiMessage = await messageModel.create({
            chat: finalChatId,
            content: result,
            role: "ai"
        })

        res.status(201).json({
            title,
            chat,
            aiMessage
        })
    } catch(err) {
        console.error("sendMessage error:", err);
        res.status(500).json({ error: err.message });
    }
}