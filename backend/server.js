const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/databaseConfig");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");
const http = require('http');
const { PeerServer } = require('peer');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// API routes for user, chat, and messages
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Serve frontend in production mode
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}

// Middleware for error handling
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Set up PeerJS server for video calls
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

// Add Socket.io for real-time chat and video call functionality
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000", // Allow requests from the frontend
        methods: ["GET", "POST"]
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // For user setup when they connect
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    // Joining a chat room
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    // Indicating typing status
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // Handling real-time messaging
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
        });
    });

    // Video call events using socket.io
    socket.emit("me", socket.id); // Send socket ID for peer connections

    // Handle initiating a video call
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });

    // Handle answering a video call
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // Handle call disconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
        console.log(`User disconnected: ${socket.id}`);
    });

    // Clean up user session when they disconnect
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

// Set the server to listen on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
