const express = require('express');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/comments/:artworkId
router.get('/:artworkId', async (req, res) => {
    try {
        const comments = await Comment.find({ artwork: req.params.artworkId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/comments/:artworkId
router.post('/:artworkId', auth, async (req, res) => {
    try {
        const comment = await Comment.create({
            artwork: req.params.artworkId,
            user: req.user._id,
            text: req.body.text,
        });

        const populated = await comment.populate('user', 'name avatar');
        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/comments/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
