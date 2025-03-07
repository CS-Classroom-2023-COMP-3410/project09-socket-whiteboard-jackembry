// main.js
import { io } from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:3000");
    window.socket = socket;

    const canvas = document.getElementById("canvas");
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let lastX = 0, lastY = 0;

    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    
    socket.on("connect", () => {});
    socket.on("connect_error", () => {});

    // Listen for drawing events
    socket.on("draw", (data) => {
        draw(data);
    });

    // Handle user drawing
    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseup", () => (isDrawing = false));

    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const data = { x, y, lastX, lastY, color: colorPicker.value, size: brushSize.value };
        lastX = x;
        lastY = y;
        socket.emit("draw", data);
        draw(data); // Draw locally for smoother experience
    });

    // Function to draw on canvas
    function draw({ x, y, lastX, lastY, color, size }) {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Clear board button
    document.getElementById("clear").addEventListener("click", () => {
        socket.emit("clearBoard");
    });

    socket.on("clearBoard", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});