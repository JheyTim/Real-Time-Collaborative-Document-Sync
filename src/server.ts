import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import sequelize from './models'; // Sequelize initialization
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.json());

// Register auth routes
app.use('/auth', authRoutes);
app.use('/api', documentRoutes);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Event: Join document room
  socket.on('join-document', (documentId) => {
    console.log(`Client ${socket.id} joined document ${documentId}`);
    socket.join(documentId); // Join the room for this specific document

    socket.to(documentId).emit('user-joined', { userId: socket.id });
  });

  // Event: Edit document (changes are broadcast to others in the room)
  socket.on('edit-document', (data) => {
    const { documentId, content } = data;

    // Broadcast the change to others in the same room
    socket.to(documentId).emit('document-updated', { content });
    console.log(`Document ${documentId} updated by client ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Optionally handle user leaving a document room
    // Broadcast that the user has left
    socket.broadcast.emit('user-left', { userId: socket.id });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server is running on port ${PORT}`);
});
