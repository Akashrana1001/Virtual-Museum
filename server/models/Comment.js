const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: [true, 'Comment text is required'],
        maxlength: 1000,
        trim: true,
    },
}, {
    timestamps: true,
});

commentSchema.index({ artwork: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
