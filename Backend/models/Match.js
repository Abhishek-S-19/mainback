const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    result: {
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        team1Score: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 }
        },
        team2Score: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 }
        }
    },
    umpires: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema); 