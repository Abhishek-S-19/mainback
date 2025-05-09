const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    battingStyle: {
        type: String,
        enum: ['Right-handed', 'Left-handed']
    },
    bowlingStyle: {
        type: String,
        enum: ['Right-arm fast', 'Right-arm medium', 'Right-arm spin', 'Left-arm fast', 'Left-arm medium', 'Left-arm spin']
    },
    stats: {
        matches: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        catches: { type: Number, default: 0 },
        stumpings: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Player', playerSchema); 