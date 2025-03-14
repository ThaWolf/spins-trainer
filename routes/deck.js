const express = require('express');
const prisma = require('../config/db');
const router = express.Router();

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
    if (rangeData[handNotation]) {
        return rangeData[handNotation]; // Exact match first
    }

    for (let key in rangeData) {
        if (key.includes("+")) {
            let baseHand = key.replace("+", ""); // Remove the "+"
            let baseRank = baseHand.substring(1, baseHand.length - 1); // Extract rank (e.g., "T" from "ATs")
            let isSuited = baseHand.endsWith("s");
            let isOffsuit = baseHand.endsWith("o");

            const rankOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
            let baseIndex = rankOrder.indexOf(baseRank); // Find index of the base rank

            let handRank = handNotation.substring(1, handNotation.length - 1); // Extract rank from `handNotation`
            let handIndex = rankOrder.indexOf(handRank);

            // ✅ Ensure only same or stronger hands are included
            if (
                handNotation.startsWith(baseHand[0]) && // Same high card (e.g., "A")
                ((isOffsuit && handNotation.endsWith("o")) || (isSuited && handNotation.endsWith("s"))) && // Same suit type
                handIndex >= baseIndex // MUST BE EQUAL OR STRONGER
            ) {
                return rangeData[key]; // Return matched range action
            }
        }
    }

    return ["FOLD", "FOLD", "FOLD"]; // Default action
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

module.exports = router;
