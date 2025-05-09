const Match = require('../models/Match');
const Team = require('../models/Team');

// Create a new match
exports.createMatch = async (req, res) => {
    try {
        const match = new Match(req.body);
        await match.save();
        
        // Update teams' matches array
        await Team.findByIdAndUpdate(match.team1, { $push: { matches: match._id } });
        await Team.findByIdAndUpdate(match.team2, { $push: { matches: match._id } });
        
        res.status(201).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all matches
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('team1 team2 result.winner');
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get match by ID
exports.getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('team1 team2 result.winner');
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update match
exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('team1 team2 result.winner');
        
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete match
exports.deleteMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        // Remove match from teams' matches array
        await Team.findByIdAndUpdate(match.team1, { $pull: { matches: match._id } });
        await Team.findByIdAndUpdate(match.team2, { $pull: { matches: match._id } });
        
        await match.remove();
        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update match status
exports.updateMatchStatus = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        
        match.status = req.body.status;
        if (req.body.status === 'Completed' && req.body.result) {
            match.result = req.body.result;
            
            // Update team stats
            if (match.result.winner) {
                await Team.findByIdAndUpdate(match.result.winner, { $inc: { wins: 1 } });
                const loser = match.team1.toString() === match.result.winner.toString() 
                    ? match.team2 
                    : match.team1;
                await Team.findByIdAndUpdate(loser, { $inc: { losses: 1 } });
            } else {
                await Team.findByIdAndUpdate(match.team1, { $inc: { draws: 1 } });
                await Team.findByIdAndUpdate(match.team2, { $inc: { draws: 1 } });
            }
        }
        
        await match.save();
        res.status(200).json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get matches by team
exports.getMatchesByTeam = async (req, res) => {
    try {
        const matches = await Match.find({
            $or: [{ team1: req.params.teamId }, { team2: req.params.teamId }]
        }).populate('team1 team2 result.winner');
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 