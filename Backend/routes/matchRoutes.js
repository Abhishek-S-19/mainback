const express = require('express');
const router = express.Router();
const matchController = require('../controller/matchController');

// Match CRUD routes
router.post('/', matchController.createMatch);
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

// Match status routes
router.put('/:id/status', matchController.updateMatchStatus);

// Team-specific match routes
router.get('/team/:teamId', matchController.getMatchesByTeam);

module.exports = router; 