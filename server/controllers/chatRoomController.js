const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const createChatRoom = async (req, res) => {
    const { name } = req.body;
    try {
        const existingRoom = await ChatRoom.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ message: 'Chat room already exists' });
        }
        const newRoom = new ChatRoom({ name });
        await newRoom.save();
        res.status(201).json({ message: 'Chat room created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating chat room' });
    }
};


const listChatRooms = async (req, res) => {
    try {
        const chatRooms = await ChatRoom.find().populate('users', ['username', 'email']);
        res.json(chatRooms);
    } catch (error) {
        res.status(500).json({ message: 'Error listing chat rooms' });
    }
};

const joinChatRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        console.log(`Request to join chat room with ID: ${roomId}`);
        const chatRoom = await ChatRoom.findById(roomId);

        if (!chatRoom) {
            res.status(404).json({ message: 'Chat room not found' });
            return;
        }

        console.log(`Found chat room: ${chatRoom}`);
        const userId = req.body.userId;
        if (!chatRoom.users.includes(userId)) {
            chatRoom.users.push(userId);
            await chatRoom.save();
        }

        const messages = await Message.find({ chatRoom: roomId });

        res.json({ message: 'Joined chat room successfully', messages: messages });
    } catch (error) {
        console.error('Error joining chat room:', error);
        res.status(500).json({ message: 'Error joining chat room' });
    }
};


module.exports = { createChatRoom, joinChatRoom, listChatRooms };
