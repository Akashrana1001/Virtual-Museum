const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'https://virtual-museum-dun.vercel.app'],
            methods: ['GET', 'POST'],
        },
    });

    // Track connected users per room
    const roomUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join a gallery room for chat
        socket.on('join-room', ({ roomId, userName }) => {
            socket.join(roomId);
            socket.userName = userName;
            socket.currentRoom = roomId;

            if (!roomUsers.has(roomId)) {
                roomUsers.set(roomId, new Set());
            }
            roomUsers.get(roomId).add({ id: socket.id, name: userName });

            io.to(roomId).emit('room-users', {
                users: Array.from(roomUsers.get(roomId)),
                count: roomUsers.get(roomId).size,
            });

            socket.to(roomId).emit('user-joined', {
                userName,
                message: `${userName} entered the gallery`,
            });
        });

        // Chat message
        socket.on('chat-message', ({ roomId, message, userName }) => {
            io.to(roomId).emit('chat-message', {
                id: Date.now(),
                userName,
                message,
                timestamp: new Date().toISOString(),
            });
        });

        // User moved to another position in 3D gallery
        socket.on('user-move', ({ roomId, position }) => {
            socket.to(roomId).emit('user-moved', {
                id: socket.id,
                userName: socket.userName,
                position,
            });
        });

        // Leave room
        socket.on('leave-room', ({ roomId }) => {
            socket.leave(roomId);
            if (roomUsers.has(roomId)) {
                const users = roomUsers.get(roomId);
                users.forEach(u => {
                    if (u.id === socket.id) users.delete(u);
                });
                io.to(roomId).emit('room-users', {
                    users: Array.from(users),
                    count: users.size,
                });
            }

            socket.to(roomId).emit('user-left', {
                userName: socket.userName,
                message: `${socket.userName} left the gallery`,
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            if (socket.currentRoom && roomUsers.has(socket.currentRoom)) {
                const users = roomUsers.get(socket.currentRoom);
                users.forEach(u => {
                    if (u.id === socket.id) users.delete(u);
                });
                io.to(socket.currentRoom).emit('room-users', {
                    users: Array.from(users),
                    count: users.size,
                });
                socket.to(socket.currentRoom).emit('user-left', {
                    userName: socket.userName,
                    message: `${socket.userName} left the gallery`,
                });
            }
        });
    });

    return io;
};

module.exports = initSocket;
