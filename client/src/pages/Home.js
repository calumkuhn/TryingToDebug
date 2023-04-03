import React, { useState, useEffect, useContext, useMemo } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import CreateChatRoom from '../components/CreateChatRoom';
import { socket, SocketContext } from '../SocketContext';

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

        const handleDisconnect = () => {
            console.log('Socket disconnected');
        };

        const handleMessage = (message) => {
            console.log('New message received:', message);
            handleSendMessage(message);
        };

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('disconnect', handleDisconnect);
        socket.on('message', handleMessage);

        fetchData();

        return () => {
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
            socket.off('disconnect', handleDisconnect);
            socket.off('message', handleMessage);
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

            try {
                if (!response.ok) {
                    throw new Error('Failed to join chat room');
                }
            } catch (error) {
                console.error(error.message);
                // Handle the error, e.g., show an error message or redirect to another page
                return;
            }

            const responseData = await response.json();
            if (Array.isArray(responseData.messages)) {
                setMessages(responseData.messages);
            } else {
                console.error('Fetched messages data is not an array:', responseData);
            }

            setCurrentRoomId(roomId);

            // Use the socket instance to join the room
            console.log('Joining room:', roomId);
            socket.emit('joinRoom', { roomId, username });

            // Listen for new messages
            console.log('Listening for new messages');
            socket.on('message', (message) => {
                console.log('New message received:', message);
                handleSendMessage(message);
            });
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

    const handleSendMessage = (newMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleCreateChatRoom = (newChatRoom) => {
        setChatRooms((prevChatRooms) => [...prevChatRooms, newChatRoom]);
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
            <CreateChatRoom onChatRoomCreated={handleCreateChatRoom} />
            <ChatRoomList chatRooms={chatRooms} onJoin={handleJoin} />
            {currentRoomId && (
                <ChatRoom
                    roomId={currentRoomId}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    username={username}
                />
            )}
        </div>
    );
};

export default Home;