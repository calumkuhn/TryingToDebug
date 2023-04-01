const express = require('express');
const router = express.Router();
const { createChatRoom, joinChatRoom, listChatRooms } = require('../controllers/chatRoomController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createChatRoom);
router.post('/:id/join', authMiddleware, joinChatRoom);
router.get('/', authMiddleware, listChatRooms);

module.exports = router;
