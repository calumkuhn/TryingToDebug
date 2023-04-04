const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const mongoose = require('mongoose');

exports.getMessages = async (req, res) => {
    const chatRoomId = req.params.id;
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
        res.status(404).json({ message: 'Chat room not found' });
        return;
    }

    const messages = await Message.find({ chatRoom: chatRoomId });
    res.json(messages);
};

// Save message function
exports.saveMessage = async (roomId, messageData) => {
    try {
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            throw new Error('Chat room not found');
        }

        const message = new Message({
            chatRoom: roomId,
            user: new mongoose.Types.ObjectId(messageData.userId),
            content: messageData.message,
            timestamp: new Date()
        });
        console.log('Constructed message:', message);

        const savedMessage = await message.save();
        return savedMessage;
    } catch (error) {
        console.error('Error saving message:', error);
        return null;
    }
};
