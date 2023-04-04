import React, { useState, useEffect, useContext, useMemo } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import CreateChatRoom from '../components/CreateChatRoom';
import { socket, SocketContext } from '../SocketContext';
import "../styles/Home.css";


const Home = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const socketContext = useContext(SocketContext);
    const socket = useMemo(() => socketContext, [socketContext]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                const chatRoomsResponse = await fetch('/api/chatrooms', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
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
        console.log("Socket instance:", socket);

        // Add event listeners
        const handleConnect = () => {
            console.log('Socket connected:', socket.connected);
        };

        const handleConnectError = (error) => {
            console.error('Socket connection error:', error);
        };

        const handleDisconnect = (reason) => {
            console.log('Socket disconnected. Reason:', reason);
        };

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('disconnect', handleDisconnect);

        fetchData();

        return () => {
            console.log("Cleaning up useEffect in Home.js");
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
            socket.off('disconnect', handleDisconnect);
        };
    }, [socket]);

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
                console.error('Failed to join chat room');
                return;
            }

            const responseData = await response.json();
            console.log('Response data:', responseData);
            if (Array.isArray(responseData.messages)) {
                setMessages(responseData.messages);
            } else {
                console.error('Fetched messages data is not an array:', responseData);
            }

            setCurrentRoomId(roomId);

            // Use the socket instance to join the room
            console.log('Joining room:', roomId);
            socket.emit('joinRoom', { roomId, username , userId });

            // Listen for new messages
            console.log('Listening for new messages');
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

    const handleNewMessage = (newMessage) => {
        console.log("New message received:", newMessage);
        if (newMessage.chatRoom === currentRoomId) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };


    const handleCreateChatRoom = (newChatRoom) => {
        setChatRooms((prevChatRooms) => [...prevChatRooms, newChatRoom]);
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Home</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <CreateChatRoom onChatRoomCreated={handleCreateChatRoom} />
            <ChatRoomList chatRooms={chatRooms} onJoin={handleJoin} />
            {currentRoomId && (
                <ChatRoom roomId={currentRoomId} messages={messages} onNewMessage={handleNewMessage} username={username} userId={userId} />
            )}
        </div>
    );
};

export default Home;