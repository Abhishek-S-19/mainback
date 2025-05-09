const express = require('express');
const router = express.Router();
const scoreController = require('../controller/scoreController');

// Score CRUD routes
router.post('/', scoreController.createScore);
router.get('/', scoreController.getAllScores);
router.get('/:id', scoreController.getScoreById);
router.put('/:id', scoreController.updateScore);
router.delete('/:id', scoreController.deleteScore);

// Match-specific score routes
router.get('/match/:matchId', scoreController.getScoresByMatch);

// Player-specific score routes
router.get('/player/:playerId', scoreController.getScoresByPlayer);

module.exports = router; 