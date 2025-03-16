const express = require('express');
const prisma = require('../config/db');
const router = express.Router();

// Create a new preflop table
router.post('/', async (req, res) => {
    const { heroPosition, villainPosition, level, variation, possibleVillainActions, rangeData } = req.body;
    try {
        const preflopTable = await prisma.preflopTable.create({
            data: { heroPosition, villainPosition, level, variation, possibleVillainActions, rangeData }
        });
        res.status(201).json(preflopTable);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all preflop tables
router.get('/', async (req, res) => {
    try {
        const preflopTables = await prisma.preflopTable.findMany();
        res.json(preflopTables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/random', async (req, res) => {
    let { level } = req.query;
    
    if (!level) {
        return res.status(400).json({ error: "Level is required" });
    }

    level = level.trim();

    try {
        const tables = await prisma.preflopTable.findMany({
            where: { level }
        });

        if (tables.length === 0) {
            return res.status(404).json({ error: "No preflop tables found for the given level" });
        }

        const randomTable = tables[Math.floor(Math.random() * tables.length)];
        res.json(randomTable);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Get a single preflop table by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('entre aca y este es mi ID', parseInt(id))
    try {
        const preflopTable = await prisma.preflopTable.findUnique({ where: { id: parseInt(id) } });
        if (!preflopTable) return res.status(404).json({ error: 'Preflop table not found' });
        res.json(preflopTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a preflop table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.preflopTable.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
