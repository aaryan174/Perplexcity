import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/Auth.slice"
import chatReducer from "../features/chat/Chat.slice"

 export  const store = configureStore({
    reducer:{
      auth: authReducer,
      chat: chatReducer
    }
});