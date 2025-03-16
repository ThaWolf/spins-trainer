const express = require('express');
const prisma = require('../config/db');
const router = express.Router();
const range_to_array = require('../services/range_to_array')

// Function to generate a shuffled deck
const generateDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ rank, suit });
        });
    });
    
    return deck.sort(() => Math.random() - 0.5);
};

// Function to convert hand to poker notation
const convertToPokerNotation = (hand) => {
    const rankOrder = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    
    let [card1, card2] = hand;
    let suited = card1.suit === card2.suit ? 's' : 'o';
    
    let sortedHand = [card1, card2].sort((a, b) => rankOrder[b.rank] - rankOrder[a.rank]);
    return sortedHand[0].rank + sortedHand[1].rank + (sortedHand[0].rank !== sortedHand[1].rank ? suited : '');
};

// Function to check if hand falls into a range with + notation
const isHandInRange = (handNotation, rangeData) => {
    for (let entry of rangeData.data) {
        const handArray = range_to_array(entry.range); // Convert range string to array
        if (handArray.includes(handNotation)) {
            return entry.actions; // Return the associated actions if hand matches
        }
    }
    return ["FOLD", "FOLD", "FOLD"]; // Default action if no match found
};






// Endpoint to deal 2 random cards
router.get('/deal-hand', (req, res) => {
    const deck = generateDeck();
    const hand = deck.slice(0, 2);
    res.json({ hand });
});

// Endpoint to compare hand with a given Preflop Table range
router.post('/compare-hand/:tableId', async (req, res) => {
    const { tableId } = req.params;
    const { hand } = req.body;
    
    if (!hand || hand.length !== 2) {
        return res.status(400).json({ error: "Invalid hand format. Must contain exactly 2 cards." });
    }

    try {
        const handNotation = convertToPokerNotation(hand);
        
        const preflopTable = await prisma.preflopTable.findUnique({
            where: { id: parseInt(tableId) },
            select: { rangeData: true }
        });

        if (!preflopTable) {
            return res.status(404).json({ error: "Preflop table not found." });
        }

        const assignedActions = isHandInRange(handNotation, preflopTable.rangeData);

        res.json({ hand: handNotation, actions: assignedActions });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

router.post('/generate-scenario', async (req, res) => {
    const { hand, rangeData} = req.body;

    if (!hand || !rangeData ) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    // ✅ Validate hand format
    if (!Array.isArray(hand) || hand.length !== 2 || !hand[0].rank || !hand[1].rank) {
        return res.status(400).json({ error: "Invalid hand format. Expected an array of two card objects.",hand });
    }

    if (!rangeData || !rangeData.data) {
        return res.status(400).json({ error: "Invalid rangeData format." });
    }

    try {
        // Convert hand to poker notation
        const handNotation = convertToPokerNotation(hand);
        // Determine possible actions
        const possibleActions = isHandInRange(handNotation, rangeData);

        if (!possibleActions) {
            return res.status(404).json({ error: "Hand not found in range data" });
        }

        const expectedAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
        let villainAction;

        if (expectedAction === possibleActions[0]) {
            villainAction = "NONE";
        } else if (expectedAction === possibleActions[1]) {
            villainAction = "BET";
        } else if (expectedAction === possibleActions[2]) {
            villainAction = "ALL_IN";
        } else {
            return res.status(400).json({ error: "Invalid villain action" });
        }

        res.json({ expectedAction , villainAction});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
