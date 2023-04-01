const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');

router.get('/chatroom/:id', getMessages);

module.exports = router;
