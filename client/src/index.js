import React from 'react';
import { createRoot } from 'react-dom/client';
import { SocketContext, socket } from './SocketContext';
import App from './App';
import "./styles/App.css";

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <SocketContext.Provider value={socket}>
                <App />
            </SocketContext.Provider>
        </React.StrictMode>
    );
} else {
    console.error('Target container (root) not found');
}
