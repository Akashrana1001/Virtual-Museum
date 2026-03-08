import { useState, useEffect } from 'react';
import { artworkAPI, eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiX, FiTrash2, FiImage, FiCalendar, FiUsers, FiPlusCircle } from 'react-icons/fi';
import './Admin.css';

const Admin = () => {
    const { isAdmin } = useAuth();
    const [tab, setTab] = useState('pending');
    const [pending, setPending] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventForm, setEventForm] = useState({
        title: '', description: '', date: '', type: 'virtual', coverImage: '', maxAttendees: 100,
    });
    const [showEventForm, setShowEventForm] = useState(false);

    useEffect(() => {
        if (tab === 'pending') loadPending();
        if (tab === 'events') loadEvents();
    }, [tab]);

    const loadPending = async () => {
        setLoading(true);
        try {
            const { data } = await artworkAPI.getPending();
            setPending(data);
        } catch (err) { }
        setLoading(false);
    };

    const loadEvents = async () => {
        setLoading(true);
        try {
            const { data } = await eventAPI.getAll({ limit: 50 });
            setEvents(data.events);
        } catch (err) { }
        setLoading(false);
    };

    const handleApprove = async (id, status) => {
        try {
            await artworkAPI.approve(id, status);
            setPending(prev => prev.filter(a => a._id !== id));
        } catch (err) { }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await eventAPI.create(eventForm);
            setShowEventForm(false);
            setEventForm({ title: '', description: '', date: '', type: 'virtual', coverImage: '', maxAttendees: 100 });
            loadEvents();
        } catch (err) { }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await eventAPI.delete(id);
            setEvents(prev => prev.filter(e => e._id !== id));
        } catch (err) { }
    };

    if (!isAdmin) return <div className="page container"><h1>Access Denied</h1><p>Admin only.</p></div>;

    return (
        <div className="page admin-page container">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage artworks, events, and content</p>
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
                    <FiImage /> Pending Artworks {pending.length > 0 && <span className="tab-badge">{pending.length}</span>}
                </button>
                <button className={`tab-btn ${tab === 'events' ? 'active' : ''}`} onClick={() => setTab('events')}>
                    <FiCalendar /> Events
                </button>
            </div>

            {loading ? <div className="loading-page"><div className="spinner"></div></div> : (
                <>
                    {tab === 'pending' && (
                        <div className="admin-section">
                            {pending.length === 0 ? (
                                <div className="empty-state"><p>No pending artworks to review.</p></div>
                            ) : (
                                <div className="pending-list">
                                    {pending.map(art => (
                                        <div key={art._id} className="pending-item glass-card" id={`pending-${art._id}`}>
                                            <img src={art.imageUrl} alt={art.title} className="pending-img" />
                                            <div className="pending-info">
                                                <h3>{art.title}</h3>
                                                <p className="pending-artist">by {art.artist?.name} ({art.artist?.email})</p>
                                                <p className="pending-desc">{art.description?.slice(0, 150)}</p>
                                                <span className="badge badge-gold">{art.category}</span>
                                            </div>
                                            <div className="pending-actions">
                                                <button className="btn btn-primary btn-sm" onClick={() => handleApprove(art._id, 'approved')}>
                                                    <FiCheck /> Approve
                                                </button>
                                                <button className="btn btn-outline btn-sm" onClick={() => handleApprove(art._id, 'rejected')} style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}>
                                                    <FiX /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'events' && (
                        <div className="admin-section">
                            <button className="btn btn-primary" onClick={() => setShowEventForm(!showEventForm)}>
                                <FiPlusCircle /> Create Event
                            </button>

                            {showEventForm && (
                                <form className="event-form glass-card" onSubmit={handleCreateEvent} id="create-event-form">
                                    <h3>New Event</h3>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-input" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Date & Time</label>
                                            <input type="datetime-local" className="form-input" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-input" value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}>
                                                <option value="virtual">Virtual</option>
                                                <option value="physical">Physical</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Cover Image URL</label>
                                        <input className="form-input" value={eventForm.coverImage} onChange={(e) => setEventForm({ ...eventForm, coverImage: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <button type="submit" className="btn btn-gold">Create Event</button>
                                </form>
                            )}

                            <div className="events-admin-list">
                                {events.map(event => (
                                    <div key={event._id} className="event-admin-item glass-card">
                                        <div>
                                            <h4>{event.title}</h4>
                                            <span className="badge badge-blue">{event.type}</span>
                                            <p>{new Date(event.date).toLocaleString()} · {event.rsvps?.length || 0} RSVPs</p>
                                        </div>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteEvent(event._id)}>
                                            <FiTrash2 color="var(--accent-rose)" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Admin;
