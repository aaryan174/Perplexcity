import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// init app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// ✅ FIXED CORS (important for Render)
app.use(cors({
  origin: true, // allows both local + deployed frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// static frontend (SPA)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// SPA fallback — only for non-API GET requests
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;