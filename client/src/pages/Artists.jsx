import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { FiInstagram, FiTwitter, FiGlobe, FiUsers } from 'react-icons/fi';
import './Artists.css';

const Artists = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userAPI.getArtists()
            .then(({ data }) => setArtists(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

    return (
        <div className="page artists-page container">
            <div className="page-header">
                <h1>Featured Artists</h1>
                <p>Discover talented creators from around the world</p>
            </div>

            <div className="grid grid-3">
                {artists.map((artist, i) => (
                    <Link
                        to={`/artist/${artist._id}`}
                        key={artist._id}
                        className={`artist-card glass-card fade-in stagger-${(i % 4) + 1}`}
                        id={`artist-card-${artist._id}`}
                    >
                        <div className="artist-card-header">
                            <img
                                src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&background=1e293b&color=f0c040&size=120`}
                                alt={artist.name}
                                className="artist-card-avatar"
                            />
                            <div className="artist-card-stats">
                                <span><FiUsers size={14} /> {artist.followers?.length || 0} followers</span>
                            </div>
                        </div>
                        <h3 className="artist-card-name">{artist.name}</h3>
                        <p className="artist-card-bio">{artist.bio?.slice(0, 100) || 'Digital artist'}{artist.bio?.length > 100 ? '...' : ''}</p>
                        <div className="artist-card-social">
                            {artist.socialLinks?.instagram && <span><FiInstagram size={14} /></span>}
                            {artist.socialLinks?.twitter && <span><FiTwitter size={14} /></span>}
                            {artist.website && <span><FiGlobe size={14} /></span>}
                        </div>
                    </Link>
                ))}
            </div>

            {artists.length === 0 && (
                <div className="empty-state">
                    <p>No artists found. Be the first to join!</p>
                    <Link to="/register" className="btn btn-gold">Join as Artist</Link>
                </div>
            )}
        </div>
    );
};

export default Artists;
