const request = require('supertest');
const app = require('../../../app');

describe('given db empty of posts when http request GET /post', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([]);
    });
});

describe('given empty db when http request POST /post', () => {
    it('then should add posts to the db', async () => {
        const body = {
            "sender": "Tal",
            "title": "Post 2",
            "content": "HELLO 12345!!"
        };
        const res = await request(app).post('/post')
            .send(body);
        const resBody = res.body;
        delete resBody._id;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

describe('given db initialized with posts when http request GET /post', () => {
    it('then should return all posts in the db', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toEqual([]);
    });
});
