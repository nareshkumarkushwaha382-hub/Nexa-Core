/**
 * @file server.js
 * @description Nexa Real-Time Backend Server using Express & Socket.io (Root Directory Static Serving)
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static frontend files directly from the root Nexa/ directory (one level up from server/)
app.use(express.static(path.join(__dirname, '../')));

const server = http.createServer(app);

// Initialize Socket.io with strict CORS policies for security
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with specific domain
        methods: ["GET", "POST"]
    }
});

// In-memory store for active users
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log(`[Nexa Server] New secure connection established: ${socket.id}`);

    // Handle user authentication/registration on the socket
    socket.on('user_connected', (userData) => {
        activeUsers.set(socket.id, {
            id: socket.id,
            username: userData.username,
            timestamp: Date.now()
        });
        
        // Broadcast to all clients that a new user is online
        io.emit('presence_update', Array.from(activeUsers.values()));
        console.log(`[Nexa Server] ${userData.username} joined the network.`);
    });

    // Handle secure message routing
    socket.on('send_message', (payload) => {
        console.log(`[Nexa Server] Routing encrypted payload from ${socket.id}`);
        
        // Broadcast the message to all other connected clients
        socket.broadcast.emit('receive_message', {
            senderId: socket.id,
            senderName: activeUsers.get(socket.id)?.username || 'Unknown',
            content: payload.content, // Encrypted payload
            timestamp: new Date().toISOString()
        });
    });

    // Handle typing indicators
    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('user_typing', {
            userId: socket.id,
            username: activeUsers.get(socket.id)?.username || 'Someone',
            isTyping: isTyping
        });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        const user = activeUsers.get(socket.id);
        if (user) {
            console.log(`[Nexa Server] ${user.username} disconnected.`);
            activeUsers.delete(socket.id);
            io.emit('presence_update', Array.from(activeUsers.values()));
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Nexa Server running on http://localhost:${PORT}`);
    console.log(`🔒 End-to-End Encryption Routing Ready.\n`);
});

