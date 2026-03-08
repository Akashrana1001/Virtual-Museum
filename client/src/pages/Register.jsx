import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
    const { register, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
            navigate('/');
        } catch (err) { }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <span className="logo-icon">◆</span>
                    <h1>Join the Gallery</h1>
                    <p>Create your account to start exploring</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} id="register-form">
                    <div className="form-group">
                        <label className="form-label"><FiUser size={14} /> Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            id="register-name"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiMail size={14} /> Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            id="register-email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiLock size={14} /> Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Min. 6 characters"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            minLength={6}
                            required
                            id="register-password"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">I want to join as</label>
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={`role-btn ${form.role === 'user' ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, role: 'user' })}
                            >
                                Art Lover
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${form.role === 'artist' ? 'active' : ''}`}
                                onClick={() => setForm({ ...form, role: 'artist' })}
                            >
                                Artist
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-gold btn-lg auth-btn" disabled={loading} id="register-submit">
                        {loading ? 'Creating account...' : <><FiUserPlus /> Create Account</>}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
