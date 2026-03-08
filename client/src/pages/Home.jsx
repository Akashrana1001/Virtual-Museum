import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { artworkAPI, eventAPI } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import { FiArrowRight, FiBox, FiSmartphone, FiUsers, FiCalendar } from 'react-icons/fi';
import './Home.css';

const Home = () => {
    const [featuredArt, setFeaturedArt] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        artworkAPI.getAll({ limit: 8 }).then(r => setFeaturedArt(r.data.artworks)).catch(() => { });
        eventAPI.getAll({ limit: 3 }).then(r => setEvents(r.data.events)).catch(() => { });
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero" id="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>
                    <div className="hero-orb hero-orb-3"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-badge fade-in">✦ Immersive Art Experience</div>
                    <h1 className="hero-title fade-in stagger-1">
                        Step Into the<br />
                        <span className="hero-gradient">Virtual Museum</span>
                    </h1>
                    <p className="hero-subtitle fade-in stagger-2">
                        Explore stunning artworks in an immersive 3D gallery. View masterpieces in
                        Augmented Reality. Connect with artists from around the world.
                    </p>
                    <div className="hero-actions fade-in stagger-3">
                        <Link to="/gallery3d" className="btn btn-gold btn-lg" id="hero-explore-btn">
                            <FiBox /> Enter 3D Gallery
                        </Link>
                        <Link to="/gallery" className="btn btn-outline btn-lg" id="hero-browse-btn">
                            Browse Collection <FiArrowRight />
                        </Link>
                    </div>
                    <div className="hero-stats fade-in stagger-4">
                        <div className="hero-stat">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Artworks</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Artists</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">3</span>
                            <span className="stat-label">Gallery Rooms</span>
                        </div>
                        <div className="hero-stat">
                            <span className="stat-number">AR</span>
                            <span className="stat-label">Enabled</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features container" id="features">
                <div className="section-header">
                    <h2>Experience Art Like Never Before</h2>
                    <p>Cutting-edge technology meets timeless artistry</p>
                </div>
                <div className="grid grid-4 features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon" style={{ background: 'var(--accent-blue-soft)' }}>
                            <FiBox color="var(--accent-blue)" size={28} />
                        </div>
                        <h3>3D Virtual Gallery</h3>
                        <p>Walk through beautifully crafted gallery rooms with realistic lighting and textures</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon" style={{ background: 'var(--accent-gold-soft)' }}>
                            <FiSmartphone color="var(--accent-gold)" size={28} />
                        </div>
                        <h3>AR Experience</h3>
                        <p>View any artwork in your own space using Augmented Reality on your phone</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                            <FiUsers color="var(--accent-purple)" size={28} />
                        </div>
                        <h3>Artist Community</h3>
                        <p>Connect with artists, follow their journey, and discover new creators</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                            <FiCalendar color="var(--accent-emerald)" size={28} />
                        </div>
                        <h3>Live Events</h3>
                        <p>Attend virtual exhibitions, live painting sessions, and artist Q&As</p>
                    </div>
                </div>
            </section>

            {/* Featured Artworks */}
            <section className="featured container" id="featured-artworks">
                <div className="section-header">
                    <h2>Featured Collection</h2>
                    <Link to="/gallery" className="btn btn-ghost">
                        View All <FiArrowRight />
                    </Link>
                </div>
                <div className="grid grid-4">
                    {featuredArt.map((art, i) => (
                        <ArtworkCard key={art._id} artwork={art} index={i} />
                    ))}
                </div>
                {featuredArt.length === 0 && (
                    <div className="empty-state">
                        <p>No artworks yet. Be the first to explore our gallery!</p>
                        <Link to="/gallery3d" className="btn btn-primary">Enter 3D Gallery</Link>
                    </div>
                )}
            </section>

            {/* Events Preview */}
            {events.length > 0 && (
                <section className="events-preview container" id="upcoming-events">
                    <div className="section-header">
                        <h2>Upcoming Exhibitions</h2>
                        <Link to="/events" className="btn btn-ghost">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="grid grid-3">
                        {events.map(event => (
                            <div key={event._id} className="event-preview-card glass-card">
                                {event.coverImage && (
                                    <div className="event-preview-img">
                                        <img src={event.coverImage} alt={event.title} />
                                    </div>
                                )}
                                <div className="event-preview-info">
                                    <span className="badge badge-blue">{event.type}</span>
                                    <h3>{event.title}</h3>
                                    <p className="event-date">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                    <p className="event-desc">{event.description?.slice(0, 120)}...</p>
                                    <Link to={`/events`} className="btn btn-outline btn-sm">Learn More</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="cta" id="cta">
                <div className="container cta-content">
                    <h2>Ready to Experience Art in a New Dimension?</h2>
                    <p>Join our community of art lovers and creators. Upload your art, explore galleries in 3D, and experience masterpieces in AR.</p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn btn-gold btn-lg">Join Now — It's Free</Link>
                        <Link to="/gallery3d" className="btn btn-outline btn-lg">Try 3D Gallery</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
