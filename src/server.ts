import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import sequelize from './models'; // Sequelize initialization
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.json());

// Register auth routes
app.use('/auth', authRoutes);

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
server.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server is running on port ${PORT}`);
});
