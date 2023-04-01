import React, { useState } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]); // Fetch chat rooms from API
    const [messages, setMessages] = useState([]); // Fetch messages from API
    const [currentRoomId, setCurrentRoomId] = useState(null);

    const handleJoin = async (roomId) => {
        try {
            const roomResponse = await fetch(`/api/chatrooms/${roomId}`);
            if (!roomResponse.ok) {
                throw new Error('Failed to fetch chat room');
            }

            const roomData = await roomResponse.json();

            const messagesResponse = await fetch(`/api/chatrooms/${roomId}/messages`);
            if (!messagesResponse.ok) {
                throw new Error('Failed to fetch messages');
            }

            const messagesData = await messagesResponse.json();

            setChatRooms([...chatRooms, roomData]);
            setMessages(messagesData);
            setCurrentRoomId(roomId);
        } catch (error) {
            console.error(error);
        }
    };


    const handleSendMessage = async (message) => {
        try {
            const response = await fetch(`/api/chatrooms/${currentRoomId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const newMessage = await response.json();
            setMessages([...messages, newMessage]);
        } catch (error) {
            console.error(error);
        }
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
