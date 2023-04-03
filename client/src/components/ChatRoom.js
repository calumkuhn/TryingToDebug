import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../SocketContext';

const ChatRoom = ({ roomId, messages, onSendMessage, username}) => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit('joinRoom', { roomId, username });

        socket.on('message', (newMessage) => {
            onSendMessage(newMessage);
        });

        return () => {
            socket.off('message'); // Unsubscribe from the 'message' event
            socket.disconnect();
        };
    }, [ roomId, username, onSendMessage]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', { roomId, message, username });
            setMessage('');
        }
    };


    return (
        <div className="chat-room">
            <h2 className="room-title">Chat Room</h2>
            <div className="messages-container">
                <ul className="messages-list">
                    {messages.map((msg, index) => (
                        <li key={`realtime-${index}`} className="message-item">
                            {msg.content}
                        </li>
                    ))}
                </ul>
            </div>
            <form onSubmit={handleSubmit} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
