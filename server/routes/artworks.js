const express = require('express');
const Artwork = require('../models/Artwork');
const Rating = require('../models/Rating');
const { auth, adminOnly, artistOrAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/artworks — list all approved artworks (public)
router.get('/', async (req, res) => {
    try {
        const { category, room, artist, search, page = 1, limit = 20 } = req.query;
        const filter = { status: 'approved' };

        if (category) filter.category = category;
        if (room) filter.room = Number(room);
        if (artist) filter.artist = artist;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        const artworks = await Artwork.find(filter)
            .populate('artist', 'name avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Artwork.countDocuments(filter);

        res.json({
            artworks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/artworks/room/:roomNumber — artworks for 3D room
router.get('/room/:roomNumber', async (req, res) => {
    try {
        const artworks = await Artwork.find({
            room: req.params.roomNumber,
            status: 'approved',
        }).populate('artist', 'name avatar');

        res.json(artworks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/artworks/pending — admin: get pending artworks
router.get('/pending', auth, adminOnly, async (req, res) => {
    try {
        const artworks = await Artwork.find({ status: 'pending' })
            .populate('artist', 'name email avatar');
        res.json(artworks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/artworks/:id — single artwork
router.get('/:id', async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id)
            .populate('artist', 'name avatar bio website socialLinks');

        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        artwork.views += 1;
        await artwork.save();

        res.json(artwork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/artworks — create artwork (artist/admin)
router.post('/', auth, artistOrAdmin, async (req, res) => {
    try {
        const artwork = await Artwork.create({
            ...req.body,
            artist: req.user._id,
            status: req.user.role === 'admin' ? 'approved' : 'pending',
        });

        res.status(201).json(artwork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/artworks/:id — update artwork
router.put('/:id', auth, async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updated = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH /api/artworks/:id/approve — admin approve/reject
router.patch('/:id/approve', auth, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected' });
        }

        const artwork = await Artwork.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        res.json(artwork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/artworks/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await artwork.deleteOne();
        res.json({ message: 'Artwork deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/artworks/:id/rate
router.post('/:id/rate', auth, async (req, res) => {
    try {
        const { value } = req.body;
        if (!value || value < 1 || value > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        await Rating.findOneAndUpdate(
            { artwork: req.params.id, user: req.user._id },
            { value },
            { upsert: true, new: true }
        );

        const stats = await Rating.aggregate([
            { $match: { artwork: require('mongoose').Types.ObjectId(req.params.id) } },
            { $group: { _id: null, avg: { $avg: '$value' }, count: { $sum: 1 } } },
        ]);

        if (stats.length > 0) {
            await Artwork.findByIdAndUpdate(req.params.id, {
                averageRating: Math.round(stats[0].avg * 10) / 10,
                totalRatings: stats[0].count,
            });
        }

        res.json({ averageRating: stats[0]?.avg || value, totalRatings: stats[0]?.count || 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
