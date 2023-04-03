import React from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);
const socket = io('http://localhost:5001', { transports: ['websocket'] });

export { SocketContext, socket };
