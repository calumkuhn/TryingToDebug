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
const { saveMessage } = require('./controllers/messageController');
const Message = require('./models/Message');


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    },
    pingTimeout: 30000
});

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
    socket.on('joinRoom', ({ roomId, username , userId}) => {
        console.log(`User ${username} joined room ${roomId}`);
        socket.join(roomId);

        socket.roomId = roomId;
        socket.username = username;
        socket.userId = userId;

        // Broadcast message to the room
        socket.broadcast.to(roomId).emit('message', {
            content: `${username} has joined the chat`,
        });

        // Listen for sendMessage event
        socket.on('sendMessage', async ({ userId, content }) => {
            console.log('Received message:', { userId, content });
            const savedMessage = await saveMessage(roomId, {
                userId: socket.userId,
                message: content
            });
            console.log('Saved message:', savedMessage);

            if (savedMessage) {
                const populatedMessage = await Message.findById(savedMessage._id).populate('user', 'username');
                console.log('Populated message:', populatedMessage);

                // Broadcast the message to all clients in the room (except the sender)
                socket.broadcast.to(roomId).emit('message', {
                    content: populatedMessage.content,
                    user: populatedMessage.user,
                    timestamp: populatedMessage.timestamp
                });

                // Also, send the message back to the sender
                socket.emit('message', {
                    content: populatedMessage.content,
                    user: populatedMessage.user,
                    timestamp: populatedMessage.timestamp
                });
            }
        });
    });
    // Handle disconnect event
    socket.on('disconnect', (reason) => {
        console.log('User disconnected. Reason:', reason);

        // Retrieve roomId and username from the socket object
        const { roomId, username } = socket;

        if (roomId && username) {
            socket.broadcast.to(roomId).emit('message', {
                content: `${username} has left the chat`,
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));