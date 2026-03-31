import {createSlice} from "@reduxjs/toolkit"


const chatSlice = createSlice({
    name: "chat",
    initialState:{
        chats: {},          // { [chatId]: { _id, title, createdAt, ... } }
        currentChatId: null,
        messages: [],       // messages for the currently active chat
        isLoading: false,
        isTyping: false,    // AI is generating a response
        error: null
    },

    reducers:{
        setChats:(state, action) =>{
            state.chats = action.payload
        },
        updateChat:(state, action) =>{
            // Merge a single chat into the chats map
            const chat = action.payload
            state.chats[chat._id] = { ...state.chats[chat._id], ...chat }
        },
        setCurrentChatId:(state, action) =>{
            state.currentChatId = action.payload
        },
        setMessages:(state, action) =>{
            state.messages = action.payload
        },
        addMessage:(state, action) =>{
            state.messages.push(action.payload)
        },
        setIsLoading:(state, action)=>{
            state.isLoading = action.payload
        },
        setIsTyping:(state, action)=>{
            state.isTyping = action.payload
        },
        setError:(state, action)=>{
            state.error = action.payload
        },
        removeChat:(state, action) =>{
            const chatId = action.payload
            delete state.chats[chatId]
            if(state.currentChatId === chatId){
                state.currentChatId = null
                state.messages = []
            }
        },
        clearCurrentChat:(state) =>{
            state.currentChatId = null
            state.messages = []
            state.isTyping = false
        }
    }
})


export const {
    setChats, updateChat, setCurrentChatId, setMessages, addMessage,
    setIsLoading, setIsTyping, setError, removeChat, clearCurrentChat
} = chatSlice.actions
export default chatSlice.reducer;