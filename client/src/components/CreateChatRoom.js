import React, { useState } from 'react';

const CreateChatRoom = ({ onChatRoomCreated }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/chatrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chat room name"
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateChatRoom;