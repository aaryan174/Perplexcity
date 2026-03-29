import "dotenv/config"
import app from "./src/app.js"
import ConnectToDb from "./src/config/database.js";
import http from 'http'
import { initSocket } from "./src/sockets/server.socket.js";



const  httpServer = http.createServer(app);
initSocket(httpServer);

ConnectToDb();

const port = process.env.PORT || 3000
httpServer.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
