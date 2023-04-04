import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../SocketContext';
import '../styles/ChatRoom.css';


const ChatRoom = ({ roomId, messages, onNewMessage, username, userId}) => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!socket.connected) {
            socket.emit('joinRoom', { roomId, username });
        }

        socket.on('message', (newMessage) => {
            console.log('Incoming message:', newMessage);
            onNewMessage(newMessage);
        });

        return () => {
            socket.off('message'); // Unsubscribe from the 'message' event
        };
    }, [ roomId, username, socket, onNewMessage]);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('handleSubmit called');
        console.log('roomId:', roomId);
        console.log('message:', message);
        console.log('username:', username);
        console.log('userId:', userId);
        if (message) {
            console.log('Emitting message:', { userId, content: message });
            socket.emit('sendMessage', { userId, content: message, username }, (error) => {
                if (error) {
                    console.error('Failed to send message:', error);
                } else {
                    setMessage('');
                }
            });
        }
    };


    return (
        <div className="chat-room">
            <h2 className="room-title">Chat Room</h2>
            <div className="messages-container">
                <ul className="messages-list">
                    {messages.map((msg, index) => (
                        <li key={`realtime-${index}`} className="message-item">
                            {msg.user.username}: {msg.content}
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
