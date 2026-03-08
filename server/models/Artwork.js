const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 200,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 2000,
    },
    medium: {
        type: String,
        default: 'Digital',
    },
    year: {
        type: Number,
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
        type: String,
        default: '',
    },
    dimensions: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    category: {
        type: String,
        enum: ['painting', 'sculpture', 'photography', 'digital', 'mixed-media', 'installation', 'other'],
        default: 'digital',
    },
    tags: [{ type: String }],
    room: {
        type: Number,
        default: 1,
    },
    position3D: {
        wall: { type: String, enum: ['north', 'south', 'east', 'west'], default: 'north' },
        x: { type: Number, default: 0 },
        y: { type: Number, default: 1.5 },
        z: { type: Number, default: 0 },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalRatings: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

artworkSchema.index({ artist: 1 });
artworkSchema.index({ category: 1 });
artworkSchema.index({ room: 1 });
artworkSchema.index({ status: 1 });

module.exports = mongoose.model('Artwork', artworkSchema);
