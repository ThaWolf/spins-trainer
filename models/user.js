const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Create a new user
const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: { username, email, passwordHash: hashedPassword }
    });
};

// Get all users
const getUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, username: true, email: true, createdAt: true }
    });
};

// Get user by ID
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id }
    });
};

// Get user by username
const getUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username }
    });
};

// Update user
const updateUser = async (id, username, email) => {
    return await prisma.user.update({
        where: { id },
        data: { username, email }
    });
};

// Delete user
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id }
    });
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUser
};
