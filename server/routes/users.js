const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/profile/:id — public profile
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('favorites', 'title imageUrl thumbnailUrl');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/artists — list all artists
router.get('/artists', async (req, res) => {
    try {
        const artists = await User.find({ role: 'artist' })
            .select('name avatar bio website socialLinks followers');
        res.json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/users/profile — update own profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, bio, avatar, website, socialLinks } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, bio, avatar, website, socialLinks },
            { new: true, runValidators: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users/follow/:id — follow/unfollow artist
router.post('/follow/:id', auth, async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        const target = await User.findById(req.params.id);
        if (!target) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFollowing = req.user.following.includes(req.params.id);

        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
            res.json({ following: false });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } });
            await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } });
            res.json({ following: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/users/favorite/:artworkId — toggle favorite
router.post('/favorite/:artworkId', auth, async (req, res) => {
    try {
        const isFavorited = req.user.favorites.includes(req.params.artworkId);

        if (isFavorited) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: req.params.artworkId } });
            res.json({ favorited: false });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: req.params.artworkId } });
            res.json({ favorited: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
