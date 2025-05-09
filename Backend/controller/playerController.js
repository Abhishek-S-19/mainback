const Player = require('../models/Player');

// Create a new player
exports.createPlayer = async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all players
exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().populate('team');
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('team');
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update player
exports.updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete player
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update player stats
exports.updatePlayerStats = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        
        // Update stats
        if (req.body.stats) {
            player.stats = {
                ...player.stats,
                ...req.body.stats
            };
        }
        
        await player.save();
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get players by team
exports.getPlayersByTeam = async (req, res) => {
    try {
        const players = await Player.find({ team: req.params.teamId });
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 