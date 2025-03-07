// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow CORS for all routes

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let boardState = []; // Store board state

io.on("connection", (socket) => {
    // Send board state to new clients
    socket.emit("loadBoard", boardState);

    // Listen for drawing actions and broadcast them
    socket.on("draw", (data) => {
        boardState.push(data);
        io.emit("draw", data); // Broadcast to ALL clients, including sender
    });
    
    // Listen for board clear event
    socket.on("clearBoard", () => {
        boardState = [];
        io.emit("clearBoard"); // Notify all clients
    });

    // Handle disconnect
    socket.on("disconnect", () => {});
});

server.listen(3000, () => {});