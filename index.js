const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users');
const preflopRoutes = require('./routes/preflop_tables');
const trainingRoutes = require('./routes/training_sessions');
const scenarioRoutes = require('./routes/scenarios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const deckRoutes = require('./routes/deck');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Spins Trainer API',
            version: '1.0.0',
            description: 'API for poker preflop training in Spins'
        },
        servers: [{ url: 'http://localhost:8080' }],
    },
    apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/users', userRoutes);
app.use('/preflop-tables', preflopRoutes);
app.use('/training-sessions', trainingRoutes);
app.use('/scenarios', scenarioRoutes);
app.use('/deck', deckRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Spins Trainer API running on http://localhost:${PORT}`);
    console.log(`📜 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
