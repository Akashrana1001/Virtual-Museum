const express = require('express');
const { auth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// POST /api/upload — upload image to Cloudinary
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        res.json({
            url: req.file.path,
            publicId: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/upload/multiple — upload multiple images
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }

        const files = req.files.map(f => ({
            url: f.path,
            publicId: f.filename,
        }));

        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
