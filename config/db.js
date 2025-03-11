const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => console.log("✅ Conexión a la base de datos establecida con Prisma"))
    .catch(err => console.error("❌ Error al conectar a la base de datos con Prisma:", err));

module.exports = prisma;
