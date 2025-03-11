const request = require('supertest');
const app = require('../index');
const prisma = require('../config/db');

let token;

describe('User Authentication', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
        expect(res.statusCode).toBe(201);
    });

    it('should log in an existing user', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ username: 'testuser', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });
});

describe('Preflop Tables API', () => {
    let tableId;

    it('should create a preflop table', async () => {
        const res = await request(app)
            .post('/preflop-tables')
            .set('Authorization', `Bearer ${token}`)
            .send({ heroPosition: 1, villainPosition: 2, level: 1, variation: 'standard', rangeData: 'A,K,Q' });
        expect(res.statusCode).toBe(201);
        tableId = res.body.id;
    });

    it('should retrieve all preflop tables', async () => {
        const res = await request(app)
            .get('/preflop-tables')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should delete a preflop table', async () => {
        const res = await request(app)
            .delete(`/preflop-tables/${tableId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });
});

afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.preflopTable.deleteMany();
    await prisma.$disconnect();
});
