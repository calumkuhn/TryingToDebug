const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chatrooms', chatRoomRoutes);
app.use('/api/messages', messageRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all handler for any requests that don't match the routes above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// Set up Socket.IO
io.on('connection', (socket) => {
    console.log('User connected');

    // Listen for joinRoom event
    socket.on('joinRoom', ({ roomId, username }) => {
        console.log(`User ${username} joined room ${roomId}`);
        socket.join(roomId);

        // Broadcast message to the room
        socket.broadcast.to(roomId).emit('message', {
            content: `${username} has joined the chat`,
        });

        // Listen for sendMessage event
        socket.on('sendMessage', (message) => {
            io.to(roomId).emit('message', {
                content: message,
                user: username,
            });
        });

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected');
            socket.broadcast.to(roomId).emit('message', {
                content: `${username} has left the chat`,
            });
        });
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));