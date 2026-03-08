<div align="center">

# 🏛️ Virtual Museum

### An Immersive 3D Art Gallery Experience

[![Live Demo](https://img.shields.io/badge/🌐_Frontend-Vercel-black?style=for-the-badge)](https://virtual-museum-dun.vercel.app/)
[![API](https://img.shields.io/badge/⚡_Backend-Render-46E3B7?style=for-the-badge)](https://virtual-museum-ks3i.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/Akashrana1001/Virtual-Museum)

**Walk through immersive 3D gallery rooms • View art in Augmented Reality • Chat with visitors in real time**

---

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **3D Virtual Gallery** | Walk through beautifully crafted gallery rooms built with Three.js & React Three Fiber |
| 📱 **AR Experience** | View artwork in your physical space via the WebXR API |
| 🖼️ **Artwork Upload** | Artists can upload artwork with image hosting via Cloudinary |
| 👤 **Artist Profiles** | Follow artists, browse their portfolios and social links |
| 💬 **Real-time Chat** | Chat with other visitors inside the gallery via WebSocket |
| 📅 **Event Management** | Create, browse, and RSVP for virtual exhibitions |
| 🛡️ **Admin Dashboard** | Approve/reject submitted artworks, manage events |
| ⭐ **Ratings & Comments** | Rate artworks 1–5 stars and leave comments |
| ❤️ **Favorites** | Save artworks to your personal collection |
| 🔒 **Authentication** | Secure JWT-based auth with bcrypt password hashing |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:-----:|:------------|
| **Frontend** | React 18 · Vite · Three.js · React Three Fiber · React Router v6 |
| **Backend** | Node.js · Express · MongoDB · Mongoose · Socket.io |
| **AR** | WebXR API |
| **Storage** | Cloudinary (image hosting) |
| **Auth** | JWT · bcrypt |
| **Deployment** | Vercel (frontend) · Render (backend) · MongoDB Atlas (database) |

</div>

---

## 🚀 Live Demo

| | URL |
|---|---|
| 🌐 **Frontend** | [virtual-museum-dun.vercel.app](https://virtual-museum-dun.vercel.app/) |
| ⚡ **Backend API** | [virtual-museum-ks3i.onrender.com](https://virtual-museum-ks3i.onrender.com/) |

> **Note:** The backend is hosted on Render's free tier — it may take ~30 seconds to wake up on the first request.

---

## 📂 Project Structure

```
Virtual-Museum/
├── client/                       # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation with search & auth
│   │   │   ├── Footer.jsx        # Site footer
│   │   │   ├── ArtworkCard.jsx   # Artwork display card
│   │   │   └── ChatPanel.jsx     # Real-time chat widget
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Gallery3D.jsx     # Immersive 3D gallery experience
│   │   │   ├── GalleryBrowse.jsx # 2D artwork browsing grid
│   │   │   ├── ArtworkDetail.jsx # Single artwork view + comments
│   │   │   ├── ARView.jsx        # Augmented Reality viewer
│   │   │   ├── UploadArtwork.jsx # Artist artwork submission
│   │   │   ├── Artists.jsx       # Artist directory
│   │   │   ├── ArtistProfile.jsx # Individual artist portfolio
│   │   │   ├── Events.jsx        # Event listings + RSVP
│   │   │   ├── UserProfile.jsx   # User profile & favorites
│   │   │   ├── Admin.jsx         # Admin dashboard
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── services/
│   │   │   └── api.js            # Axios API service layer
│   │   ├── App.jsx               # App routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global design system
│   ├── index.html
│   └── package.json
│
├── server/                       # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary + Multer setup
│   │   └── seed.js               # Database seeder
│   ├── middleware/
│   │   ├── auth.js               # JWT auth + role guards
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Artwork.js            # Artwork schema
│   │   ├── Comment.js            # Comment schema
│   │   ├── Rating.js             # Rating schema
│   │   └── Event.js              # Event schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── artworks.js           # Artwork CRUD + approval
│   │   ├── comments.js           # Comment endpoints
│   │   ├── users.js              # User profile endpoints
│   │   ├── events.js             # Event CRUD + RSVP
│   │   └── upload.js             # Image upload endpoint
│   ├── socket.js                 # WebSocket (Socket.io) handler
│   ├── server.js                 # Server entry point
│   └── package.json
│
└── README.md
```

---

## ⚙️ Getting Started (Local Development)

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([free tier](https://cloudinary.com/)) — for image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/Akashrana1001/Virtual-Museum.git
cd Virtual-Museum
```

### 2. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual-museum
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
```

This creates sample data:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@virtualmuseum.com` | `admin123` |
| Artist | `elena@art.com` | `artist123` |
| User | `user@test.com` | `user1234` |

Plus 12 artworks across 3 gallery rooms and 3 upcoming events.

### 5. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🔌 API Reference

**Base URL:** `/api`

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login & get JWT token | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### Artworks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/artworks` | List approved artworks (paginated) | ❌ |
| `GET` | `/artworks/:id` | Get single artwork | ❌ |
| `GET` | `/artworks/room/:num` | Get artworks by gallery room | ❌ |
| `POST` | `/artworks` | Create artwork | ✅ Artist/Admin |
| `PUT` | `/artworks/:id` | Update artwork | ✅ Owner/Admin |
| `DELETE` | `/artworks/:id` | Delete artwork | ✅ Owner/Admin |
| `PATCH` | `/artworks/:id/approve` | Approve/reject artwork | ✅ Admin |
| `POST` | `/artworks/:id/rate` | Rate artwork (1–5) | ✅ |
| `GET` | `/artworks/pending` | List pending artworks | ✅ Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/profile/:id` | Get user profile | ❌ |
| `PUT` | `/users/profile` | Update own profile | ✅ |
| `GET` | `/users/artists` | List all artists | ❌ |
| `POST` | `/users/follow/:id` | Follow/unfollow user | ✅ |
| `POST` | `/users/favorite/:id` | Toggle artwork favorite | ✅ |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/comments/:artworkId` | Get comments for an artwork | ❌ |
| `POST` | `/comments/:artworkId` | Add a comment | ✅ |
| `DELETE` | `/comments/:id` | Delete a comment | ✅ |

### Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/events` | List all events | ❌ |
| `GET` | `/events/:id` | Get single event | ❌ |
| `POST` | `/events` | Create event | ✅ Admin |
| `PUT` | `/events/:id` | Update event | ✅ Admin |
| `DELETE` | `/events/:id` | Delete event | ✅ Admin |
| `POST` | `/events/:id/rsvp` | RSVP to event | ✅ |

### Upload
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/upload` | Upload single image | ✅ |
| `POST` | `/upload/multiple` | Upload multiple images | ✅ |

---

## 🌍 Deployment

### Frontend → Vercel

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. Add environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
4. Deploy

### Backend → Render

1. Create a **Web Service** on [Render](https://render.com)
2. Set **Root Directory** to `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLOUDINARY_*`, `CLIENT_URL`
6. Deploy

### Database → MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` under **Network Access** (required for Render)
3. Copy the connection string into your `MONGODB_URI`

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Akash Rana](https://github.com/Akashrana1001)**

⭐ Star this repo if you found it interesting!

</div>
