import { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:6000');
export const SocketContext = createContext(socket);
