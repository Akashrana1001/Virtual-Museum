import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GalleryBrowse from './pages/GalleryBrowse';
import Gallery3D from './pages/Gallery3D';
import ArtworkDetail from './pages/ArtworkDetail';
import ARView from './pages/ARView';
import Artists from './pages/Artists';
import ArtistProfile from './pages/ArtistProfile';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Admin from './pages/Admin';
import ChatPanel from './components/ChatPanel';
import { useAuth } from './context/AuthContext';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-page" style={{ height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="app">
            <Routes>
                {/* 3D Gallery and AR get their own full-screen layout (no navbar/footer) */}
                <Route path="/gallery3d" element={<Gallery3D />} />
                <Route path="/ar/:id" element={<ARView />} />

                {/* Standard layout with Navbar + Footer */}
                <Route path="*" element={
                    <>
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/gallery" element={<GalleryBrowse />} />
                                <Route path="/artwork/:id" element={<ArtworkDetail />} />
                                <Route path="/artists" element={<Artists />} />
                                <Route path="/artist/:id" element={<ArtistProfile />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile" element={<UserProfile />} />
                                <Route path="/admin" element={<Admin />} />
                            </Routes>
                        </main>
                        <Footer />
                        <ChatPanel />
                    </>
                } />
            </Routes>
        </div>
    );
}

export default App;
