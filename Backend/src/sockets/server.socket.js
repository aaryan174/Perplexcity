import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);
    });

    console.log("Socket.IO server is running");
}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}