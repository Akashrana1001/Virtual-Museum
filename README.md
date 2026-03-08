# Virtual Museum — Immersive Art Gallery

A full-stack virtual museum with 3D gallery exploration, Augmented Reality viewing, real-time chat, and complete artist/event management.

## Features

- **3D Virtual Gallery** — Walk through beautifully crafted gallery rooms with Three.js
- **AR Experience** — View artwork in your physical space via WebXR
- **Artist Profiles** — Follow artists, browse their portfolios
- **Real-time Chat** — Chat with other visitors via WebSocket
- **Event Management** — RSVP for virtual exhibitions
- **Admin Dashboard** — Approve artworks, manage events
- **User Accounts** — Register, save favorites, comment & rate

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Three.js, React Three Fiber, React Router |
| Backend | Node.js, Express, MongoDB, Socket.io |
| AR | WebXR API |
| Storage | Cloudinary |
| Auth | JWT + bcrypt |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/virtual-museum
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- **Admin**: admin@virtualmuseum.com / admin123
- **Artist**: elena@art.com / artist123
- **User**: user@test.com / user1234
- 12 artworks across 3 rooms
- 3 upcoming events

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open http://localhost:5173

## Project Structure

```
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ArtworkCard, ChatPanel
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # All page components
│   │   ├── services/       # API service layer
│   │   ├── App.jsx         # Main app with routing
│   │   └── index.css       # Design system
│   └── index.html
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB, Cloudinary, seed data
│   ├── middleware/          # Auth, error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # REST API endpoints
│   ├── socket.js           # WebSocket handler
│   └── server.js           # Entry point
└── README.md
```
