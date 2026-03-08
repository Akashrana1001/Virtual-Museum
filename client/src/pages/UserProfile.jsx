import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import { FiUser, FiHeart, FiEdit2, FiSave } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', bio: '' });

    useEffect(() => {
        authAPI.getMe().then(({ data }) => {
            setProfile(data);
            setForm({ name: data.name, bio: data.bio || '' });
        }).catch(() => { });
    }, []);

    const handleSave = async () => {
        try {
            const { data } = await import('../services/api').then(m => m.userAPI.updateProfile(form));
            setProfile(data);
            updateUser(data);
            setEditing(false);
        } catch (err) { }
    };

    if (!profile) return <div className="loading-page"><div className="spinner"></div></div>;

    return (
        <div className="page user-profile container">
            <div className="profile-header glass-card">
                <img
                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&size=120&background=1e293b&color=f0c040`}
                    alt={profile.name}
                    className="profile-avatar"
                />
                <div className="profile-info">
                    {editing ? (
                        <div className="profile-edit">
                            <input
                                className="form-input"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Name"
                            />
                            <textarea
                                className="form-input"
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={3}
                            />
                            <div className="profile-edit-actions">
                                <button className="btn btn-primary btn-sm" onClick={handleSave}><FiSave /> Save</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1>{profile.name}</h1>
                            <p className="profile-bio">{profile.bio || 'No bio yet.'}</p>
                            <div className="profile-stats">
                                <span><FiHeart /> <strong>{profile.favorites?.length || 0}</strong> favorites</span>
                                <span><FiUser /> <strong>{profile.following?.length || 0}</strong> following</span>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                                <FiEdit2 /> Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            {profile.favorites?.length > 0 && (
                <div className="profile-section">
                    <h2><FiHeart /> Favorite Artworks</h2>
                    <div className="grid grid-4">
                        {profile.favorites.map((art, i) => (
                            <ArtworkCard key={art._id} artwork={art} index={i} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
