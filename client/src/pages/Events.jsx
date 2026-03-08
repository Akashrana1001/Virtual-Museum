import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiCheck } from 'react-icons/fi';
import './Events.css';

const Events = () => {
    const { isAuthenticated } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventAPI.getAll({ limit: 20 })
            .then(({ data }) => setEvents(data.events))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleRsvp = async (eventId) => {
        if (!isAuthenticated) return;
        try {
            const { data } = await eventAPI.rsvp(eventId);
            setEvents(prev => prev.map(e =>
                e._id === eventId ? { ...e, _rsvped: data.rsvped, rsvps: data.rsvped ? [...e.rsvps, {}] : e.rsvps.slice(0, -1) } : e
            ));
        } catch (err) { }
    };

    const getCountdown = (date) => {
        const diff = new Date(date) - new Date();
        if (diff <= 0) return 'Starting now!';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h`;
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

    return (
        <div className="page events-page container">
            <div className="page-header">
                <h1>Exhibitions & Events</h1>
                <p>Discover upcoming virtual and physical art events</p>
            </div>

            <div className="events-list">
                {events.map((event, i) => (
                    <div key={event._id} className={`event-card glass-card fade-in stagger-${(i % 4) + 1}`} id={`event-${event._id}`}>
                        {event.coverImage && (
                            <div className="event-cover">
                                <img src={event.coverImage} alt={event.title} />
                                <div className="event-countdown">
                                    <FiClock /> {getCountdown(event.date)}
                                </div>
                            </div>
                        )}
                        <div className="event-content">
                            <div className="event-content-top">
                                <span className={`badge ${event.type === 'virtual' ? 'badge-blue' : event.type === 'hybrid' ? 'badge-emerald' : 'badge-gold'}`}>
                                    {event.type}
                                </span>
                                <h3>{event.title}</h3>
                                <div className="event-details">
                                    <span><FiCalendar /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <span><FiMapPin /> {event.location || 'Virtual Gallery'}</span>
                                    <span><FiUsers /> {event.rsvps?.length || 0} attending</span>
                                </div>
                                <p className="event-description">{event.description}</p>
                                {event.featuredArtists?.length > 0 && (
                                    <div className="event-artists">
                                        <span className="event-artists-label">Featured Artists:</span>
                                        <div className="event-artists-list">
                                            {event.featuredArtists.map(a => (
                                                <span key={a._id} className="event-artist-chip">
                                                    {a.avatar && <img src={a.avatar} alt="" />}
                                                    {a.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                className={`btn ${event._rsvped ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => handleRsvp(event._id)}
                                disabled={!isAuthenticated}
                                id={`rsvp-${event._id}`}
                            >
                                {event._rsvped ? <><FiCheck /> RSVP'd</> : 'RSVP Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="empty-state">
                    <p>No upcoming events. Check back soon!</p>
                </div>
            )}
        </div>
    );
};

export default Events;
