import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiGrid, FiCalendar, FiBox, FiUsers } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/gallery?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMenuOpen(false);
        }
    };

    return (
        <nav className="navbar" id="main-nav">
            <div className="nav-inner container">
                <Link to="/" className="nav-logo">
                    <span className="logo-icon">◆</span>
                    <span className="logo-text">Virtual<span className="logo-accent">Museum</span></span>
                </Link>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/gallery" className="nav-link" onClick={() => setMenuOpen(false)}>
                        <FiGrid size={16} /> Gallery
                    </Link>
                    <Link to="/gallery3d" className="nav-link" onClick={() => setMenuOpen(false)}>
                        <FiBox size={16} /> 3D Experience
                    </Link>
                    <Link to="/artists" className="nav-link" onClick={() => setMenuOpen(false)}>
                        <FiUsers size={16} /> Artists
                    </Link>
                    <Link to="/events" className="nav-link" onClick={() => setMenuOpen(false)}>
                        <FiCalendar size={16} /> Events
                    </Link>

                    <form className="nav-search" onSubmit={handleSearch}>
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search artworks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="nav-search-input"
                        />
                    </form>

                    <div className="nav-auth">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="btn btn-sm btn-outline" onClick={() => setMenuOpen(false)}>
                                        Admin
                                    </Link>
                                )}
                                <Link to="/profile" className="nav-user" onClick={() => setMenuOpen(false)}>
                                    <FiUser size={16} />
                                    <span>{user?.name}</span>
                                </Link>
                                <button className="btn btn-ghost btn-sm" onClick={() => { logout(); setMenuOpen(false); }}>
                                    <FiLogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} id="nav-toggle">
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
