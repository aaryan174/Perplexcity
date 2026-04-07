import { io } from "socket.io-client";


export const initializeSocketConnection = ()=>{
    const socket = io(window.location.origin, {
        withCredentials: true
    })

    socket.on("connect", ()=>{
        console.log("Connected to socket.io server");
    } )
}