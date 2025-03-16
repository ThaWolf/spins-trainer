const express = require('express');
const router = express.Router();

// Enum values for Level
const LEVELS = ["BASIC", "PRO", "ELITE"];

// Endpoint to retrieve level enum values
router.get('/levels', (req, res) => {
    res.json({ levels: LEVELS });
});

module.exports = router;
