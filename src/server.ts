import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Welcome to the collaborative document backend');
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Custom event handling (will expand this later)
  socket.on('edit-document', (data) => {
    // Broadcast the document change to other users in the same room
    socket.broadcast.emit('update-document', data);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
