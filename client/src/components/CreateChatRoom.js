import React, { useState } from 'react';
import "../styles/CreateChatRoom.css";

const CreateChatRoom = ({ onChatRoomCreated }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const authToken = localStorage.getItem('authToken');

            const response = await fetch('/api/chatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                const data = await response.json();
                onChatRoomCreated(data);
                setName('');
            } else {
                console.error('Error creating chat room');
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <div>
            <h2>Create a chat room</h2>
            <form onSubmit={handleSubmit} className="create-chat-room-form">
                <input
                    type="text"
                    placeholder="Chat room name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Create Chat Room</button>
            </form>
        </div>
    );
};

export default CreateChatRoom;
