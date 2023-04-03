import React, { useState, useEffect } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import CreateChatRoom from '../components/CreateChatRoom';
import { SocketContext } from '../SocketContext';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);

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

        return () => {
        };
    }, []);

    const handleJoin = async (roomId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`/api/chatrooms/${roomId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to join chat room');
            }

            const responseData = await response.json();
            if (Array.isArray(responseData.messages)) {
                setMessages(responseData.messages);
            } else {
                console.error('Fetched messages data is not an array:', responseData);
            }

            setCurrentRoomId(roomId);
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
    };

    const handleCreateChatRoom = (newChatRoom) => {
        setChatRooms((prevChatRooms) => [...prevChatRooms, newChatRoom]);
    };

    return (
        <SocketContext.Consumer>
            {(socket) => (
                <div>
                    <h1>Home</h1>
                    <button onClick={handleLogout}>Logout</button>
                    <CreateChatRoom onChatRoomCreated={handleCreateChatRoom} />
                    <ChatRoomList chatRooms={chatRooms} onJoin={handleJoin} />
                    {currentRoomId && (
                        <ChatRoom
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    )}
                </div>
            )}
        </SocketContext.Consumer>
    );
};

export default Home;