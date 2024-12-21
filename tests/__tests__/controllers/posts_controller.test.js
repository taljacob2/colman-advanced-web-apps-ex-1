const request = require('supertest');
const app = require('../../../app');

let existingPost = null;

describe('given db empty of posts when http request GET /post', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([]);
    });
});

describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {
        const body = {
            "sender": "USERNAME",
            "title": "POST TITLE",
            "content": "POST CONTENT"
        };
        const res = await request(app).post('/post')
            .send(body);
        const resBody = res.body;
        existingPost = { ...resBody };
        delete resBody._id;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

describe('when http request POST /post without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "title": "POST TITLE",
            "content": "POST CONTENT"
        };
        const res = await request(app).post('/post')
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('given db initialized with posts when http request GET /post', () => {
    it('then should return all posts in the db', async () => {
        const res = await request(app).get('/post');
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toEqual([]);
    });
});

describe('given unknown username when http request GET /post?sender', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/post?sender=UNKNOWN');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('given existing username when http request GET /post?sender', () => {
    it('then should return his posts only', async () => {
        const res = await request(app).get('/post?sender=USERNAME');
        const resBody = res.body;
        const senderList = resBody.map((post) => post.sender);

        // Use filter and return array with unique values
        const uniqueSenderList = senderList.filter(
            (e, i, self) => i === self.indexOf(e));

        expect(res.statusCode).toBe(200);
        expect(uniqueSenderList.length).toBe(1);
        expect(uniqueSenderList[0]).toEqual(resBody[0].sender);
    });
});

describe('when http request PUT /post/id of unknown post', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "sender": "UPDATED USERNAME",
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app).put(`/post/UNKNOWN`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /post/id of existing post', () => {
    it('then should update post in the db', async () => {
        const body = {
            "sender": "UPDATED USERNAME",
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app).put(`/post/${existingPost._id}`)
            .send(body);
        const resBody = res.body;
        delete resBody._id;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

describe('when http request PUT /post/id of existing post but without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "title": "UPDATED POST TITLE",
            "content": "UPDATED POST CONTENT"
        };
        const res = await request(app).put(`/post/${existingPost._id}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});
