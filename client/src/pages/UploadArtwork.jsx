import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { artworkAPI, uploadAPI } from '../services/api';
import { FiUpload, FiImage, FiCheck, FiAlertCircle } from 'react-icons/fi';
import './UploadArtwork.css';

const CATEGORIES = [
    { value: 'painting', label: 'Painting' },
    { value: 'sculpture', label: 'Sculpture' },
    { value: 'photography', label: 'Photography' },
    { value: 'digital', label: 'Digital Art' },
    { value: 'mixed-media', label: 'Mixed Media' },
    { value: 'installation', label: 'Installation' },
    { value: 'other', label: 'Other' },
];

const UploadArtwork = () => {
    const { user, isAuthenticated, isArtist, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'digital',
        medium: 'Digital',
        year: new Date().getFullYear(),
        tags: '',
        room: 1,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    if (!isAuthenticated) {
        return (
            <div className="page container">
                <div className="upload-access-denied">
                    <FiAlertCircle size={48} />
                    <h2>Sign In Required</h2>
                    <p>Please sign in to upload artwork.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                </div>
            </div>
        );
    }

    if (!isArtist && !isAdmin) {
        return (
            <div className="page container">
                <div className="upload-access-denied">
                    <FiAlertCircle size={48} />
                    <h2>Artist Account Required</h2>
                    <p>You need an artist account to upload artwork. Please register as an artist.</p>
                </div>
            </div>
        );
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setError('Please select an image to upload.');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Step 1: Upload image to Cloudinary
            const formData = new FormData();
            formData.append('image', imageFile);
            const { data: uploadData } = await uploadAPI.uploadImage(formData);

            // Step 2: Create artwork with the uploaded image URL
            const artworkData = {
                title: form.title,
                description: form.description,
                category: form.category,
                medium: form.medium,
                year: form.year,
                room: Number(form.room),
                imageUrl: uploadData.url,
                thumbnailUrl: uploadData.url,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            await artworkAPI.create(artworkData);
            setSuccess(true);

            // Reset form
            setTimeout(() => {
                navigate('/gallery');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload artwork. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="page container">
                <div className="upload-success">
                    <div className="success-icon"><FiCheck size={48} /></div>
                    <h2>Artwork Submitted!</h2>
                    <p>{isAdmin ? 'Your artwork has been published to the gallery.' : 'Your artwork has been submitted for admin approval. You will be notified once it is reviewed.'}</p>
                    <p className="redirect-msg">Redirecting to gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page upload-page container">
            <div className="page-header">
                <h1><FiUpload /> Upload Artwork</h1>
                <p>Share your art with the world in our virtual museum</p>
            </div>

            {error && (
                <div className="upload-error">
                    <FiAlertCircle /> {error}
                </div>
            )}

            <form className="upload-form glass-card" onSubmit={handleSubmit} id="upload-artwork-form">
                <div className="upload-form-grid">
                    {/* Image upload area */}
                    <div className="upload-image-section">
                        <label className="image-dropzone" htmlFor="artwork-image-input">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="dropzone-placeholder">
                                    <FiImage size={48} />
                                    <span>Click to select artwork image</span>
                                    <span className="dropzone-hint">JPG, PNG, WebP or GIF</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                                id="artwork-image-input"
                                className="file-input-hidden"
                            />
                        </label>
                    </div>

                    {/* Form fields */}
                    <div className="upload-fields-section">
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                className="form-input"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Name of your artwork"
                                required
                                maxLength={200}
                                id="artwork-title"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                className="form-input"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Tell us about your artwork..."
                                required
                                rows={4}
                                maxLength={2000}
                                id="artwork-description"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    id="artwork-category"
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Medium</label>
                                <input
                                    className="form-input"
                                    value={form.medium}
                                    onChange={(e) => setForm({ ...form, medium: e.target.value })}
                                    placeholder="e.g. Oil on Canvas, Digital"
                                    id="artwork-medium"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={form.year}
                                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                                    min={1000}
                                    max={2100}
                                    id="artwork-year"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gallery Room</label>
                                <select
                                    className="form-input"
                                    value={form.room}
                                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                                    id="artwork-room"
                                >
                                    <option value={1}>Room 1</option>
                                    <option value={2}>Room 2</option>
                                    <option value={3}>Room 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <input
                                className="form-input"
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                placeholder="e.g. abstract, modern, landscape (comma separated)"
                                id="artwork-tags"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-upload"
                            disabled={uploading}
                            id="submit-artwork"
                        >
                            {uploading ? (
                                <><div className="spinner-sm"></div> Uploading...</>
                            ) : (
                                <><FiUpload /> Submit Artwork</>
                            )}
                        </button>

                        {!isAdmin && (
                            <p className="upload-note">
                                Note: Submitted artworks will be reviewed by an admin before appearing in the gallery.
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadArtwork;
