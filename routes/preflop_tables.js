const express = require('express');
const prisma = require('../config/db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new preflop table
router.post('/', authenticateToken, async (req, res) => {
    const { heroPosition, villainPosition, level, variation, rangeData } = req.body;
    try {
        const preflopTable = await prisma.preflopTable.create({
            data: { heroPosition, villainPosition, level, variation, rangeData }
        });
        res.status(201).json(preflopTable);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all preflop tables
router.get('/', authenticateToken, async (req, res) => {
    try {
        const preflopTables = await prisma.preflopTable.findMany();
        res.json(preflopTables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single preflop table by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const preflopTable = await prisma.preflopTable.findUnique({ where: { id: parseInt(id) } });
        if (!preflopTable) return res.status(404).json({ error: 'Preflop table not found' });
        res.json(preflopTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a preflop table
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.preflopTable.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
