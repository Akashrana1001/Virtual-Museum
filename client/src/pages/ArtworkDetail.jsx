import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artworkAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiShare2, FiSmartphone, FiMessageCircle, FiStar, FiArrowLeft } from 'react-icons/fi';
import './ArtworkDetail.css';

const ArtworkDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [artwork, setArtwork] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArtwork();
        loadComments();
    }, [id]);

    const loadArtwork = async () => {
        try {
            const { data } = await artworkAPI.getById(id);
            setArtwork(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const loadComments = async () => {
        try {
            const { data } = await commentAPI.getByArtwork(id);
            setComments(data);
        } catch (err) { }
    };

    const handleRate = async (value) => {
        if (!isAuthenticated) return;
        try {
            setUserRating(value);
            const { data } = await artworkAPI.rate(id, value);
            setArtwork(prev => ({ ...prev, averageRating: data.averageRating, totalRatings: data.totalRatings }));
        } catch (err) { }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !isAuthenticated) return;
        try {
            const { data } = await commentAPI.create(id, newComment.trim());
            setComments(prev => [data, ...prev]);
            setNewComment('');
        } catch (err) { }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await commentAPI.delete(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) { }
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!artwork) return <div className="page container"><p>Artwork not found.</p></div>;

    return (
        <div className="page artwork-detail container">
            <Link to="/gallery" className="back-link">
                <FiArrowLeft /> Back to Gallery
            </Link>

            <div className="artwork-layout">
                <div className="artwork-image-section">
                    <div className="artwork-main-image">
                        <img src={artwork.imageUrl} alt={artwork.title} />
                    </div>
                    <div className="artwork-image-actions">
                        <Link to={`/ar/${artwork._id}`} className="btn btn-gold btn-sm" id="ar-view-btn">
                            <FiSmartphone /> View in AR
                        </Link>
                        <button className="btn btn-outline btn-sm">
                            <FiShare2 /> Share
                        </button>
                        <button className="btn btn-outline btn-sm">
                            <FiHeart /> Save
                        </button>
                    </div>
                </div>

                <div className="artwork-info-section">
                    <span className="badge badge-gold">{artwork.category}</span>
                    <h1 className="artwork-title">{artwork.title}</h1>

                    <Link to={`/artist/${artwork.artist?._id}`} className="artwork-artist-link">
                        {artwork.artist?.avatar && (
                            <img src={artwork.artist.avatar} alt="" className="artist-avatar-md" />
                        )}
                        <div>
                            <span className="artist-name">{artwork.artist?.name}</span>
                            <span className="artist-label">Artist</span>
                        </div>
                    </Link>

                    <div className="artwork-meta">
                        <div className="meta-item">
                            <span className="meta-label">Medium</span>
                            <span className="meta-value">{artwork.medium}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Year</span>
                            <span className="meta-value">{artwork.year}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Views</span>
                            <span className="meta-value">{artwork.views}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Rating</span>
                            <span className="meta-value">★ {artwork.averageRating || 0} ({artwork.totalRatings || 0})</span>
                        </div>
                    </div>

                    <div className="artwork-description">
                        <h3>About this Artwork</h3>
                        <p>{artwork.description}</p>
                    </div>

                    {artwork.tags?.length > 0 && (
                        <div className="artwork-tags">
                            {artwork.tags.map(tag => (
                                <span key={tag} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Rating */}
                    <div className="rating-section">
                        <h3>Rate this Artwork</h3>
                        {isAuthenticated ? (
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={`star ${star <= (hoverRating || userRating) ? 'filled' : 'empty'}`}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >★</span>
                                ))}
                            </div>
                        ) : (
                            <p className="auth-prompt">
                                <Link to="/login">Sign in</Link> to rate this artwork
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="comments-section" id="comments">
                <h3><FiMessageCircle /> Comments ({comments.length})</h3>

                {isAuthenticated ? (
                    <form className="comment-form" onSubmit={handleComment}>
                        <img src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name} alt="" className="comment-avatar" />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            id="comment-input"
                        />
                        <button type="submit" className="btn btn-primary btn-sm" id="comment-submit">Post</button>
                    </form>
                ) : (
                    <p className="auth-prompt"><Link to="/login">Sign in</Link> to leave a comment</p>
                )}

                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment._id} className="comment glass-card" id={`comment-${comment._id}`}>
                            <img
                                src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=' + comment.user?.name}
                                alt=""
                                className="comment-avatar"
                            />
                            <div className="comment-body">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.user?.name}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                            </div>
                            {user && (comment.user?._id === user.id || user.role === 'admin') && (
                                <button
                                    className="btn btn-ghost btn-sm comment-delete"
                                    onClick={() => handleDeleteComment(comment._id)}
                                >×</button>
                            )}
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetail;
