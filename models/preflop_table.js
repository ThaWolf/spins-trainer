const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new preflop table
const createPreflopTable = async (heroPosition, villainPosition, level, variation, rangeData) => {
    return await prisma.preflopTable.create({
        data: { heroPosition, villainPosition, level, variation, rangeData }
    });
};

// Get all preflop tables
const getPreflopTables = async () => {
    return await prisma.preflopTable.findMany();
};

// Get preflop table by ID
const getPreflopTableById = async (id) => {
    return await prisma.preflopTable.findUnique({
        where: { id }
    });
};

// Update preflop table
const updatePreflopTable = async (id, heroPosition, villainPosition, level, variation, rangeData) => {
    return await prisma.preflopTable.update({
        where: { id },
        data: { heroPosition, villainPosition, level, variation, rangeData }
    });
};

// Delete preflop table
const deletePreflopTable = async (id) => {
    return await prisma.preflopTable.delete({
        where: { id }
    });
};

module.exports = {
    createPreflopTable,
    getPreflopTables,
    getPreflopTableById,
    updatePreflopTable,
    deletePreflopTable
};
