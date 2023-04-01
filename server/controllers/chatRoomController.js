const ChatRoom = require('../models/ChatRoom');

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

const joinChatRoom = async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    try {
        const room = await ChatRoom.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Chat room not found' });
        }
        if (!room.users.includes(userId)) {
            room.users.push(userId);
            await room.save();
        }
        res.status(200).json({ message: 'User joined chat room successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining chat room' });
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

module.exports = { createChatRoom, joinChatRoom, listChatRooms };
