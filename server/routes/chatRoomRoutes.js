const express = require('express');
const router = express.Router();
const { createChatRoom, joinChatRoom, listChatRooms } = require('../controllers/chatRoomController');

router.post('/', createChatRoom);
router.post('/:id/join', joinChatRoom);
router.get('/', listChatRooms);

module.exports = router;
