const request = require('supertest');
const app = require('../../../app');

describe('given empty db when http request POST /post', () => {
    it('then should add posts to the db', async () => {
        const res = await request(app).post('/post')
            .send({
                "sender": "Tal",
                "title": "Post 2",
                "content": "HELLO 12345!!"
            });
        expect(res.statusCode).toBe(201);
    });
});

describe('given db initialized with posts when http request GET /post', () => {
    it('then should return all posts in the db', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
    });
});
