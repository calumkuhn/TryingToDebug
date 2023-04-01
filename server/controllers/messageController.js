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

exports.saveMessage = async (roomId, messageData) => {
    const message = new Message({ chatRoom: roomId, ...messageData });
    await message.save();
    return message;
};
