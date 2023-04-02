import React, { useState, useEffect, useRef } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import io from 'socket.io-client';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('authToken'); // Add this line

                const chatRoomsResponse = await fetch('/api/chatrooms', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Add this line
                    },
                });
                const chatRoomsData = await chatRoomsResponse.json();
                console.log('Fetched chat rooms:', chatRoomsData);
                if (Array.isArray(chatRoomsData)) {
                    setChatRooms(chatRoomsData);
                } else {
                    console.error('Fetched data is not an array:', chatRoomsData);
                }

                const userId = localStorage.getItem('userId');
                setUserId(userId);
                const username = localStorage.getItem('username');
                setUsername(username);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();

        socketRef.current = io();

        socketRef.current.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketRef.current.disconnect();
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
            socketRef.current.emit('join', { roomId, username });
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    const handleSendMessage = (message) => {
        socketRef.current.emit('sendMessage', { roomId: currentRoomId, message, userId });
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
            <ChatRoomList chatRooms={chatRooms} onJoin={handleJoin} />
            {currentRoomId && (
                <ChatRoom messages={messages} onSendMessage={handleSendMessage} />
            )}
        </div>
    );
};

export default Home;
