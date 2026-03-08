const express = require('express');
const Event = require('../models/Event');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/events — list all upcoming events
router.get('/', async (req, res) => {
    try {
        const { status = 'upcoming', type, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const events = await Event.find(filter)
            .populate('organizer', 'name avatar')
            .populate('featuredArtists', 'name avatar')
            .sort({ date: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Event.countDocuments(filter);

        res.json({
            events,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name avatar')
            .populate('featuredArtists', 'name avatar bio')
            .populate('rsvps.user', 'name avatar');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events — admin create event
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, organizer: req.user._id });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/events/:id — admin update
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events/:id/rsvp — toggle RSVP
router.post('/:id/rsvp', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const existingIdx = event.rsvps.findIndex(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingIdx > -1) {
            event.rsvps.splice(existingIdx, 1);
            await event.save();
            res.json({ rsvped: false, count: event.rsvps.length });
        } else {
            if (event.maxAttendees > 0 && event.rsvps.length >= event.maxAttendees) {
                return res.status(400).json({ message: 'Event is full' });
            }
            event.rsvps.push({ user: req.user._id });
            await event.save();
            res.json({ rsvped: true, count: event.rsvps.length });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/events/:id
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
