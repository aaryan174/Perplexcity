import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})


export async function sendMessage({message, chatId}) {
    const res = await api.post("/api/chats/message", {message, chatId})
    return res.data
}

export async function getChats() {
    const res = await api.get("/api/chats/");
    return res.data
}

export async function getMessages(chatId) {
        const res = await api.get(`/api/chats/${chatId}/messages`);
        return res.data
}

export async function deleteChat(chatId) {
    const res = await api.delete(`/api/chats/delete/${chatId}`);
    return res.data 
}