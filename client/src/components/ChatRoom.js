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
        <div>
            <h2>Chat Room</h2>
            <ul>
                {fetchedMessages.map((msg, index) => (
                    <li key={`fetched-${index}`}>{msg.content}</li>
                ))}
                {messages.map((msg, index) => (
                    <li key={`realtime-${index}`}>{msg.content}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatRoom;
