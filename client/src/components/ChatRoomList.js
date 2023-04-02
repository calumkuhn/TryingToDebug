import React from 'react';

const ChatRoomList = ({ chatRooms= [], onJoin }) => {
    return (
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {chatRooms.map((room) => (
                    <li key={room._id} onClick={() => onJoin(room._id)}>
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
