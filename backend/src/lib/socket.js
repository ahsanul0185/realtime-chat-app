import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// check if user is online or not
export const getRecieverSocketId = (userId) => {
  return userSocketMap[userId]
}

// this is for storing online users
const userSocketMap = {}; // {userId : socketId}

io.on("connection", (socket) => {
  console.log("An user connected", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  // Handle typing events
  socket.on("userTyping", ({ receiverId }) => {
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        senderId: userId,
        isTyping: true,
      });
    }
  })


  socket.on("userStoppedTyping", ({ receiverId }) => {
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", {
        senderId: userId,
        isTyping: false,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("An user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

});


export {io, app, server};