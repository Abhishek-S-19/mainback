const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    draws: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team', teamSchema); 