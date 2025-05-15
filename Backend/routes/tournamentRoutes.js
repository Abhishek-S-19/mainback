const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { auth, checkRole } = require('../middleware/auth');

// Get all tournaments (accessible by admin and players)
router.get('/', auth, checkRole(['admin', 'player']), tournamentController.getTournaments);

// Get single tournament (accessible by admin and players)
router.get('/:id', auth, checkRole(['admin', 'player']), tournamentController.getTournament);

// Create tournament (admin only)
router.post('/', auth, checkRole(['admin']), tournamentController.createTournament);

// Update tournament (admin only)
router.put('/:id', auth, checkRole(['admin']), tournamentController.updateTournament);

// Delete tournament (admin only)
router.delete('/:id', auth, checkRole(['admin']), tournamentController.deleteTournament);

// Add match to tournament (admin only)
router.post('/:id/matches', auth, checkRole(['admin']), tournamentController.addMatch);

// Update match result (admin only)
router.put('/:id/matches/:matchId', auth, checkRole(['admin']), tournamentController.updateMatchResult);

module.exports = router; 