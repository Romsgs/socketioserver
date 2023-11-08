const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create an Express app
const app = express();
const server = http.createServer(app);

// Add middleware
app.use(cors({origin:"*"}));
app.use(express.json());

// Create a Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('send_message', (data) => {
    // Implement message validation and sanitization here if needed
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on('I_Know', (data) => {
    // Implement message validation and sanitization here if needed
    console.log(data);
    console.log(data.nome);
    socket.broadcast.emit("whoKnows", data.nome);
  });  

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
