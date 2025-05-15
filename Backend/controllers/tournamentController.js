const Tournament = require('../models/Tournament');
const Team = require('../models/Team');

// Get all tournaments
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('teams', 'name')
      .populate('matches.team1', 'name')
      .populate('matches.team2', 'name')
      .populate('matches.winner', 'name')
      .sort({ startDate: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tournament
exports.getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('teams', 'name')
      .populate('matches.team1', 'name')
      .populate('matches.team2', 'name')
      .populate('matches.winner', 'name');
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create tournament
exports.createTournament = async (req, res) => {
  try {
    const { name, startDate, endDate, teams, status } = req.body;

    // Validate teams exist
    const teamsExist = await Team.find({ _id: { $in: teams } });
    if (teamsExist.length !== teams.length) {
      return res.status(400).json({ message: 'One or more teams do not exist' });
    }

    const tournament = new Tournament({
      name,
      startDate,
      endDate,
      teams,
      status,
      createdBy: req.user._id
    });

    const savedTournament = await tournament.save();
    const populatedTournament = await Tournament.findById(savedTournament._id)
      .populate('teams', 'name');

    res.status(201).json(populatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tournament
exports.updateTournament = async (req, res) => {
  try {
    const { name, startDate, endDate, teams, status } = req.body;

    // Validate teams exist
    const teamsExist = await Team.find({ _id: { $in: teams } });
    if (teamsExist.length !== teams.length) {
      return res.status(400).json({ message: 'One or more teams do not exist' });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Only admin can update tournament
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update tournament' });
    }

    tournament.name = name;
    tournament.startDate = startDate;
    tournament.endDate = endDate;
    tournament.teams = teams;
    tournament.status = status;

    const updatedTournament = await tournament.save();
    const populatedTournament = await Tournament.findById(updatedTournament._id)
      .populate('teams', 'name')
      .populate('matches.team1', 'name')
      .populate('matches.team2', 'name')
      .populate('matches.winner', 'name');

    res.json(populatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tournament
exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Only admin can delete tournament
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete tournament' });
    }

    await tournament.remove();
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add match to tournament
exports.addMatch = async (req, res) => {
  try {
    const { team1, team2, date, venue } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Only admin can add matches
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add matches' });
    }

    // Validate teams are part of the tournament
    if (!tournament.teams.includes(team1) || !tournament.teams.includes(team2)) {
      return res.status(400).json({ message: 'Teams must be part of the tournament' });
    }

    tournament.matches.push({
      team1,
      team2,
      date,
      venue,
      status: 'scheduled'
    });

    const updatedTournament = await tournament.save();
    const populatedTournament = await Tournament.findById(updatedTournament._id)
      .populate('teams', 'name')
      .populate('matches.team1', 'name')
      .populate('matches.team2', 'name')
      .populate('matches.winner', 'name');

    res.json(populatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update match result
exports.updateMatchResult = async (req, res) => {
  try {
    const { matchId, score, winner, status } = req.body;
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Only admin can update match results
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update match results' });
    }

    const match = tournament.matches.id(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.score = score;
    match.winner = winner;
    match.status = status;

    const updatedTournament = await tournament.save();
    const populatedTournament = await Tournament.findById(updatedTournament._id)
      .populate('teams', 'name')
      .populate('matches.team1', 'name')
      .populate('matches.team2', 'name')
      .populate('matches.winner', 'name');

    res.json(populatedTournament);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 