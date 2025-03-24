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

const dealHand = () => {
    const deck = generateDeck();
    const hand = deck.slice(0, 2);
    return hand;
}

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
    return [{"villain": 'NONE', "hero":"FOLD"},{"villain": 'NONE', "hero":"FOLD"},{"villain": 'NONE', "hero":"FOLD"}]; // Default actions if no match found
};



router.get('/ranges-as-arrays/:tableId', async (req,res)=>{
    const { tableId } = req.params;

    const preflopTable = await prisma.preflopTable.findUnique({
        where: { id: parseInt(tableId) },
        select: { rangeData: true }
    });

    const  results = preflopTable.rangeData.data.map(entry => range_to_array(entry.range));

    res.json(results)

})





// Endpoint to deal 2 random cards
router.get('/deal-hand', (req, res) => {
    dealHand();
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
    const { level } = req.query;

    if (!level) {
        return res.status(400).json({ error: "Level is required" });
    }

    try {
        //Find random preflop table for the given level
        const tables = await prisma.preflopTable.findMany({
            where: { level },
        });

        if (tables.length === 0) {
            return res.status(404).json({ error: "No preflop tables found for the given level" });
        }

        const preflopTable = tables[Math.floor(Math.random() * tables.length)];

        //Deal Hand
        const hand = dealHand();

        // Convert hand to poker notation
        const handNotation = convertToPokerNotation(hand);

        // Determine possible actions
        const possibleActions = isHandInRange(handNotation, preflopTable.rangeData);

        //Determine an expected action
        const expectedActions = possibleActions[Math.floor(Math.random() * possibleActions.length)];
        
        res.json({ hand, preflopTable, expectedActions });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;
