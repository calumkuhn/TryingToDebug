import React, { useState } from 'react';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';

const Home = () => {
    const [chatRooms, setChatRooms] = useState([]); // Fetch chat rooms from API
    const [messages, setMessages] = useState([]); // Fetch messages from API
    const [currentRoomId, setCurrentRoomId] = useState(null);

    const handleJoin = (roomId) => {
        // Implement room joining logic
        setCurrentRoomId(roomId);
    };

    const handleSendMessage = (message) => {
        // Implement message sending logic
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
