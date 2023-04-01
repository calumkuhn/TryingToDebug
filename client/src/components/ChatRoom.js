import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../SocketContext';

const ChatRoom = ({ roomId }) => {
    const socket = useContext(SocketContext);
    const [fetchedMessages, setFetchedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/messages/chatroom/${roomId}`);
            const data = await response.json();

            setFetchedMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        socket.emit('joinRoom', { roomId, username: 'YourUsername' }); // Replace with your user's username

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket, roomId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', message);
            setMessage('');
        }
    };

    return (
        <div className="chat-room">
            <h2 className="room-title">Chat Room</h2>
            <div className="messages-container">
                <ul className="messages-list">
                    {fetchedMessages.map((msg, index) => (
                        <li key={`fetched-${index}`} className="message-item">
                            {msg.content}
                        </li>
                    ))}
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
