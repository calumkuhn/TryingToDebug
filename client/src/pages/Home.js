import React, { useState, useEffect } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import io from 'socket.io-client';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]); // Fetch chat rooms from API
    const [messages, setMessages] = useState([]); // Fetch messages from API
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null); // Add this line
    const socket = io();

    useEffect(() => {
        // Fetch chat rooms, user ID, and username from API when the component mounts
        const fetchData = async () => {
            try {
                // Replace with the actual API endpoint to fetch chat rooms
                const chatRoomsResponse = await fetch('/api/chatrooms');
                const chatRoomsData = await chatRoomsResponse.json();
                setChatRooms(chatRoomsData);

                // Fetch user ID and username from local storage or your preferred method
                const userId = localStorage.getItem('userId');
                setUserId(userId);
                const username = localStorage.getItem('username'); // Add this line
                setUsername(username); // Add this line
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();

        // Add a listener for new messages from the server
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            // Clean up the socket connection
            socket.disconnect();
        };
    }, []);

    const handleJoin = async (roomId) => {
        try {
            const response = await fetch(`/api/chatrooms/${roomId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to join chat room');
            }

            setCurrentRoomId(roomId);
            socket.emit('join', { roomId, username }); // Add this line
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = (message) => {
        // Emit the sendMessage event through the socket
        socket.emit('sendMessage', { roomId: currentRoomId, message, userId });
    };

    return (
        <div>
            <h1>Home</h1>
            <ChatRoomList chatRooms={chatRooms} onJoin={handleJoin} />
            {currentRoomId && (
                <ChatRoom messages={messages} onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};

export default Home;
