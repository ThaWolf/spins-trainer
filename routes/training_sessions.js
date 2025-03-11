const express = require('express');
const prisma = require('../config/db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new training session
router.post('/', authenticateToken, async (req, res) => {
    const { tableId, hand, actionTaken, correctAction, result } = req.body;
    try {
        const trainingSession = await prisma.trainingSession.create({
            data: {
                userId: req.user.id,
                tableId,
                hand,
                actionTaken,
                correctAction,
                result
            }
        });
        res.status(201).json(trainingSession);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all training sessions (protected)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const sessions = await prisma.trainingSession.findMany({
            where: { userId: req.user.id }
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a training session by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.trainingSession.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
