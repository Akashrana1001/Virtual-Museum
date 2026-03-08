import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiEye } from 'react-icons/fi';
import './ArtworkCard.css';

const ArtworkCard = ({ artwork, index = 0 }) => {
    return (
        <Link
            to={`/artwork/${artwork._id}`}
            className={`artwork-card glass-card fade-in stagger-${(index % 4) + 1}`}
            id={`artwork-card-${artwork._id}`}
        >
            <div className="artwork-card-image">
                <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    loading="lazy"
                />
                <div className="artwork-card-overlay">
                    <span className="badge badge-gold">{artwork.category}</span>
                    <div className="artwork-card-actions">
                        <span className="artwork-stat"><FiEye /> {artwork.views || 0}</span>
                        <span className="artwork-stat"><FiStar /> {artwork.averageRating || 0}</span>
                    </div>
                </div>
            </div>
            <div className="artwork-card-info">
                <h3 className="artwork-card-title">{artwork.title}</h3>
                <div className="artwork-card-artist">
                    {artwork.artist?.avatar && (
                        <img src={artwork.artist.avatar} alt="" className="artist-mini-avatar" />
                    )}
                    <span>{artwork.artist?.name || 'Unknown Artist'}</span>
                </div>
                <p className="artwork-card-medium">{artwork.medium} · {artwork.year}</p>
            </div>
        </Link>
    );
};

export default ArtworkCard;
