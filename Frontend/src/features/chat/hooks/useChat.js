import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import {
    setChats, updateChat, setCurrentChatId, setMessages, addMessage,
    setIsLoading, setIsTyping, setError, removeChat, clearCurrentChat
} from "../Chat.slice";


export const useChat = () => {

    const dispatch = useDispatch()
    const chats = useSelector((state) => state.chat.chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)
    const messages = useSelector((state) => state.chat.messages)
    const isLoading = useSelector((state) => state.chat.isLoading)
    const isTyping = useSelector((state) => state.chat.isTyping)
    const error = useSelector((state) => state.chat.error)
    const [streamedMsgId, setStreamedMsgId] = useState(null);

    // ─── Fetch all chats for sidebar ──────────────────────────────────
    async function handleGetChats() {
        try {
            dispatch(setIsLoading(true))
            const data = await getChats()
            // Convert array to map keyed by _id
            const chatsMap = {}
            const chatList = data.chats || data || []
            chatList.forEach((chat) => {
                chatsMap[chat._id] = chat
            })
            dispatch(setChats(chatsMap))
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to fetch chats"))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    // ─── Send message (new or existing chat) ──────────────────────────
    async function handleSendMessage({ message, chatId }) {
        try {
            // Optimistically add user message to UI
            const tempUserMsg = {
                _id: "temp-" + Date.now(),
                content: message,
                role: "user",
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage(tempUserMsg))
            dispatch(setIsTyping(true))

            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data

            // Update the chat in sidebar
            dispatch(updateChat(chat))

            // If this is a new chat, set it as current
            if (!chatId) {
                dispatch(setCurrentChatId(chat._id))
            }

            // Add AI response to messages
            dispatch(addMessage(aiMessage))
            setStreamedMsgId(aiMessage._id)
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(setIsTyping(false))
        }
    }

    // ─── Load messages for a specific chat ────────────────────────────
    async function handleSelectChat(chatId) {
        try {
            dispatch(setCurrentChatId(chatId))
            dispatch(setIsLoading(true))
            dispatch(setMessages([]))  // Clear while loading

            const data = await getMessages(chatId)
            const messageList = data.messages || data || []
            dispatch(setMessages(messageList))
            setStreamedMsgId(null) // Reset streaming for history load
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to load messages"))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    // ─── Delete a chat ────────────────────────────────────────────────
    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId)
            dispatch(removeChat(chatId))
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || "Failed to delete chat"))
        }
    }

    // ─── New chat (reset current) ─────────────────────────────────────
    function handleNewChat() {
        dispatch(clearCurrentChat())
    }

    return {
        // state
        chats,
        currentChatId,
        messages,
        isLoading,
        isTyping,
        error,
        streamedMsgId,

        // actions
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleSelectChat,
        handleDeleteChat,
        handleNewChat,
    }
}
