import React from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext();

// You should replace the URL with the URL where your server is running
const socket = io('http://localhost:3001');

export { SocketContext, socket };
