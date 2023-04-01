import { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:6000'); // Replace with your server URL
export const SocketContext = createContext(socket);
