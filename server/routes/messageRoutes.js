const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/chatroom/:id', authMiddleware, getMessages);

module.exports = router;
