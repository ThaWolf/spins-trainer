const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new scenario
const createScenario = async (tableId, scenarioType, villainAction, expectedAction) => {
    return await prisma.scenario.create({
        data: { tableId, scenarioType, villainAction, expectedAction }
    });
};

// Get all scenarios
const getScenarios = async () => {
    return await prisma.scenario.findMany();
};

// Get scenario by ID
const getScenarioById = async (id) => {
    return await prisma.scenario.findUnique({
        where: { id }
    });
};

// Update scenario
const updateScenario = async (id, tableId, scenarioType, villainAction, expectedAction) => {
    return await prisma.scenario.update({
        where: { id },
        data: { tableId, scenarioType, villainAction, expectedAction }
    });
};

// Delete scenario
const deleteScenario = async (id) => {
    return await prisma.scenario.delete({
        where: { id }
    });
};

module.exports = {
    createScenario,
    getScenarios,
    getScenarioById,
    updateScenario,
    deleteScenario
};
