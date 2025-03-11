const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new training session
const createTrainingSession = async (userId, tableId, hand, actionTaken, correctAction, result) => {
    return await prisma.trainingSession.create({
        data: { userId, tableId, hand, actionTaken, correctAction, result }
    });
};

// Get all training sessions
const getTrainingSessions = async () => {
    return await prisma.trainingSession.findMany();
};

// Get training sessions by user ID
const getTrainingSessionsByUserId = async (userId) => {
    return await prisma.trainingSession.findMany({
        where: { userId }
    });
};

// Delete a training session by ID
const deleteTrainingSession = async (id) => {
    return await prisma.trainingSession.delete({
        where: { id }
    });
};

module.exports = {
    createTrainingSession,
    getTrainingSessions,
    getTrainingSessionsByUserId,
    deleteTrainingSession
};
