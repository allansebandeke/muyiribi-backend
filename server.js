const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./database");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const requestRoutes = require("./routes/requestRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Middleware for security & performance
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(compression()); // Compress responses for faster load times
app.use(helmet()); // Secure HTTP headers
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("✅ Muyiribi Backend is Running!");
});

// Socket.io Real-Time Messaging & Notifications
io.on("connection", (socket) => {
  console.log("🔵 A user connected:", socket.id);

  socket.on("sendMessage", async (messageData) => {
    io.emit("receiveMessage", messageData);
  });

  socket.on("sendNotification", async (notificationData) => {
    io.emit("receiveNotification", notificationData);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
