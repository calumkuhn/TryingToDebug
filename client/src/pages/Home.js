import React, { useState, useEffect, useRef } from 'react'; // Add useRef import
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import io from 'socket.io-client';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]); // Fetch chat rooms from API
    const [messages, setMessages] = useState([]); // Fetch messages from API
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null); // Add this line
    const socketRef = useRef(); // Add this line

    useEffect(() => {
        // Fetch chat rooms, user ID, and username from API when the component mounts
        const fetchData = async () => {
            try {
                // Replace with the actual API endpoint to fetch chat rooms
                const chatRoomsResponse = await fetch('/api/chatrooms');
                const chatRoomsData = await chatRoomsResponse.json();
                console.log('Fetched chat rooms:', chatRoomsData);
                if (Array.isArray(chatRoomsData)) { // Add this condition
                    setChatRooms(chatRoomsData);
                } else {
                    console.error('Fetched data is not an array:', chatRoomsData);
                }
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

        socketRef.current = io(); // Move socket creation inside useEffect

        // Add a listener for new messages from the server
        socketRef.current.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            // Clean up the socket connection
            socketRef.current.disconnect(); // Use the ref
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
            socketRef.current.emit('join', { roomId, username }); // Use the ref
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = (message) => {
        // Emit the sendMessage event through the socket
        socketRef.current.emit('sendMessage', { roomId: currentRoomId, message, userId }); // Use the ref
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
