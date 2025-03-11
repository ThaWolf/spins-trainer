const express = require('express');
const prisma = require('../config/db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new scenario
router.post('/', authenticateToken, async (req, res) => {
    const { tableId, scenarioType, villainAction, expectedAction } = req.body;
    try {
        const scenario = await prisma.scenario.create({
            data: { tableId, scenarioType, villainAction, expectedAction }
        });
        res.status(201).json(scenario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all scenarios
router.get('/', authenticateToken, async (req, res) => {
    try {
        const scenarios = await prisma.scenario.findMany();
        res.json(scenarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single scenario by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const scenario = await prisma.scenario.findUnique({ where: { id: parseInt(id) } });
        if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
        res.json(scenario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a scenario
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.scenario.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
