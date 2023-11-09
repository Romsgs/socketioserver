const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Create an Express app
const app = express();
const server = http.createServer(app);

// Add middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Create a Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io event handling
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("I_Know", (data) => {
    // Implement message validation and sanitization here if needed
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 3);

    const currentHour = currentDate.getHours().toString().padStart(2, "0");
    const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
    const currentSecond = currentDate.getSeconds().toString().padStart(2, "0");

    const formattedTime = `${currentHour}:${currentMinute}:${currentSecond}`;

    socket.emit("whoKnows", { nome: data.nome, time: formattedTime });
    socket.broadcast.emit("whoKnows", data.nome);
  });

  socket.on("reset", () => {
    socket.emit("reseted");
    socket.broadcast.emit("reseted");
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
