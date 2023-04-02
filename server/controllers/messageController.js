const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

exports.getMessages = async (req, res) => {
    try {
        const chatRoomId = req.params.id;
        const chatRoom = await ChatRoom.findById(chatRoomId);

        if (!chatRoom) {
            res.status(404).json({ message: 'Chat room not found' });
            return;
        }

        const messages = await Message.find({ chatRoom: chatRoomId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
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
            user: messageData.userId,
            content: messageData.message,
            timestamp: new Date()
        });

        await message.save();
        return message;
    } catch (error) {
        console.error(`Error saving message: ${error.message}`);
        return null;
    }
};
