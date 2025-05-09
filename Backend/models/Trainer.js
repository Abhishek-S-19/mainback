const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        enum: ['Batting', 'Bowling', 'Fielding', 'Fitness', 'All-round'],
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    contact: {
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    achievements: [{
        title: String,
        year: Number,
        description: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trainer', trainerSchema); 