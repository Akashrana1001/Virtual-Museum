import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI, artworkAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArtworkCard from '../components/ArtworkCard';
import { FiInstagram, FiTwitter, FiGlobe, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import './ArtistProfile.css';

const ArtistProfile = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [artist, setArtist] = useState(null);
    const [artworks, setArtworks] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArtist();
        loadArtworks();
    }, [id]);

    const loadArtist = async () => {
        try {
            const { data } = await userAPI.getProfile(id);
            setArtist(data);
            if (user) setIsFollowing(data.followers?.includes(user.id));
        } catch (err) { }
        setLoading(false);
    };

    const loadArtworks = async () => {
        try {
            const { data } = await artworkAPI.getAll({ artist: id, limit: 50 });
            setArtworks(data.artworks);
        } catch (err) { }
    };

    const handleFollow = async () => {
        if (!isAuthenticated) return;
        try {
            const { data } = await userAPI.follow(id);
            setIsFollowing(data.following);
            setArtist(prev => ({
                ...prev,
                followers: data.following
                    ? [...(prev.followers || []), user.id]
                    : prev.followers.filter(f => f !== user.id),
            }));
        } catch (err) { }
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!artist) return <div className="page container"><p>Artist not found.</p></div>;

    return (
        <div className="page artist-profile container">
            <div className="artist-profile-header glass-card">
                <img
                    src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=150`}
                    alt={artist.name}
                    className="artist-profile-avatar"
                />
                <div className="artist-profile-info">
                    <h1>{artist.name}</h1>
                    <p className="artist-profile-bio">{artist.bio || 'No bio yet.'}</p>
                    <div className="artist-profile-stats">
                        <span><strong>{artworks.length}</strong> artworks</span>
                        <span><strong>{artist.followers?.length || 0}</strong> followers</span>
                        <span><strong>{artist.following?.length || 0}</strong> following</span>
                    </div>
                    <div className="artist-profile-links">
                        {artist.website && <a href={artist.website} target="_blank" rel="noreferrer"><FiGlobe /> Website</a>}
                        {artist.socialLinks?.instagram && <a href="#"><FiInstagram /> {artist.socialLinks.instagram}</a>}
                        {artist.socialLinks?.twitter && <a href="#"><FiTwitter /> {artist.socialLinks.twitter}</a>}
                    </div>
                    {isAuthenticated && user?.id !== id && (
                        <button className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`} onClick={handleFollow}>
                            {isFollowing ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
                        </button>
                    )}
                </div>
            </div>

            <div className="artist-artworks">
                <h2>Artworks by {artist.name}</h2>
                <div className="grid grid-4">
                    {artworks.map((art, i) => (
                        <ArtworkCard key={art._id} artwork={art} index={i} />
                    ))}
                </div>
                {artworks.length === 0 && <p className="empty-state">No artworks yet.</p>}
            </div>
        </div>
    );
};

export default ArtistProfile;
