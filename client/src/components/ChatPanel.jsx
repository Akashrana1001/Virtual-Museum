import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { FiMessageCircle, FiX, FiSend, FiUsers } from 'react-icons/fi';
import './ChatPanel.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const ChatPanel = ({ roomId = 'gallery-main' }) => {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [userCount, setUserCount] = useState(0);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-room', { roomId, userName: user.name });
        });

        socket.on('chat-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('user-joined', (data) => {
            setMessages(prev => [...prev, { id: Date.now(), userName: 'System', message: data.message, system: true }]);
        });

        socket.on('user-left', (data) => {
            setMessages(prev => [...prev, { id: Date.now(), userName: 'System', message: data.message, system: true }]);
        });

        socket.on('room-users', (data) => {
            setUserCount(data.count);
        });

        return () => {
            socket.emit('leave-room', { roomId });
            socket.disconnect();
        };
    }, [isAuthenticated, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !socketRef.current) return;
        socketRef.current.emit('chat-message', {
            roomId,
            message: input.trim(),
            userName: user.name,
        });
        setInput('');
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <button
                className={`chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                id="chat-toggle"
            >
                {isOpen ? <FiX size={20} /> : <FiMessageCircle size={20} />}
                {userCount > 0 && !isOpen && <span className="chat-badge">{userCount}</span>}
            </button>

            <div className={`chat-panel ${isOpen ? 'open' : ''}`} id="chat-panel">
                <div className="chat-header">
                    <h3><FiMessageCircle /> Gallery Chat</h3>
                    <span className="chat-online"><FiUsers size={14} /> {userCount} online</span>
                </div>

                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chat-msg ${msg.system ? 'system' : ''} ${msg.userName === user.name ? 'own' : ''}`}>
                            {!msg.system && <span className="chat-msg-user">{msg.userName}</span>}
                            <span className="chat-msg-text">{msg.message}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Say something..."
                        className="chat-input"
                        id="chat-input"
                    />
                    <button type="submit" className="chat-send" id="chat-send">
                        <FiSend size={16} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChatPanel;
