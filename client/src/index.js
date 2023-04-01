import React from 'react';
import ReactDOM from 'react-dom';
import { SocketContext } from './SocketContext';
import { socket } from './SocketContext';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <SocketContext.Provider value={socket}>
            <App />
        </SocketContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
