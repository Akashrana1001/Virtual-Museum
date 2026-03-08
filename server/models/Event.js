const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 3000,
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    endDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['virtual', 'physical', 'hybrid'],
        default: 'virtual',
    },
    coverImage: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: 'Virtual Gallery',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    featuredArtists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    rsvps: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rsvpDate: { type: Date, default: Date.now },
    }],
    maxAttendees: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed', 'cancelled'],
        default: 'upcoming',
    },
}, {
    timestamps: true,
});

eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);
