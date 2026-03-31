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

export async function getChats(req, res) {
    const user = req.user
    
    const chats = await chatModel.find({user: user.id })

    res.status(200).json({
        message: "Chats retrived Successfully",
        chats
    })
}

export async function getMessages(req, res) {
        const {chatId} = req.params;
        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        })

        if(!chat){
            return res.status(404).json({
                message: "Chat not Found"
            })
        }
        
        const messages = await messageModel.find({
            chat: chatId
        })

        res.status(200).json({
            message: "Message retrived Successfully",
            messages
        })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}