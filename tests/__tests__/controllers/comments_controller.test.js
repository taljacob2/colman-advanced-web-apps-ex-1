const request = require('supertest');
const app = require('../../../app');

let existingPost = null;
let existingComment = null;

describe('given db empty of comments when http request GET /comment', () => {
    it('then should return empty list', async () => {
        const res = await request(app).get('/comment');
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([]);
    });
});

/**
 * Already tested in posts_controller.
 * We need this just for initializing `existingPost`.
 */
describe('when http request POST /post', () => {
    it('then should add post to the db', async () => {
        const body = {
            "sender": "USERNAME1",
            "title": "POST1 TITLE",
            "content": "POST1 CONTENT"
        };
        const res = await request(app).post('/post')
            .send(body);
        const resBody = res.body;
        existingPost = { ...resBody };
    });
});

describe('when http request POST /comment to an unknown post', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment to an existing post without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost._id}`,
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request POST /comment without required postId field', () => {
    it('then should return 404 not found http status', async () => {
        const body = {
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);

        expect(res.statusCode).toBe(404);
    });
});

describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        const body = {
            "postId": `${existingPost._id}`,
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        const res = await request(app).post('/comment')
            .send(body);
        const resBody = res.body;
        existingComment = { ...resBody };
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

/**
 * Already tested this.
 * We need this just for initializing some more comments.
 */
describe('when http request POST /comment  to an existing post', () => {
    it('then should add comment to the db', async () => {
        // Comment 1
        const body1 = {
            "postId": `${existingPost._id}`,
            "sender": "USERNAME1",
            "content": "COMMENT1 CONTENT"
        };
        await request(app).post('/comment').send(body1);

        // Comment 2
        const body2 = {
            "postId": `${existingPost._id}`,
            "sender": "USERNAME2",
            "content": "COMMENT2 CONTENT"
        };
        await request(app).post('/comment').send(body2);

        // Comment 3
        const body3 = {
            "postId": `${existingPost._id}`,
            "sender": "USERNAME3",
            "content": "COMMENT3 CONTENT"
        };
        await request(app).post('/comment').send(body3);
    });
});

describe('given db initialized with comments when http request GET /comment', () => {
    it('then should return all coments in the db', async () => {
        const res = await request(app).get('/comment');
        expect(res.statusCode).toBe(200);
        expect(res.statusCode).not.toEqual([]);
    });
});

describe('when http request PUT /comment/id of unknown post', () => {
    it('then should return 201 created http status', async () => {
        const body = {
            "postId": "UNKNOWN",
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody.postId).toEqual(existingPost._id);
    });
});

describe('when http request PUT /comment/id of unknown comment', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost._id}`,
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/UNKNOWN`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /comment/id without required postId field', () => {
    it('then should return 201 created http status', async () => {
        const body = {
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody.postId).toEqual(existingPost._id);
    });
});

describe('when http request PUT /comment/id without required sender field', () => {
    it('then should return 400 bad request http status', async () => {
        const body = {
            "postId": `${existingPost._id}`,
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);

        expect(res.statusCode).toBe(400);
    });
});

describe('when http request PUT /comment/id of existing post and comment', () => {
    it('then should update comment in the db', async () => {
        const body = {
            "postId": `${existingPost._id}`,
            "sender": "UPDATED USERNAME",
            "content": "UPDATED COMMENT CONTENT"
        };
        const res = await request(app).put(`/comment/${existingComment._id}`)
            .send(body);
        const resBody = res.body;
        delete resBody._id;
        delete resBody.createdAt;
        delete resBody.updatedAt;

        expect(res.statusCode).toBe(201);
        expect(resBody).toEqual(body);
    });
});

describe('given existing post when http request GET /comment/post/id', () => {
    it('then should return its comments only', async () => {
        const res = await request(app).get(`/comment/post/${existingPost._id}`);
        const resBody = res.body;
        const postIds = resBody.map((comment) => comment.postId);

        // Use filter and return array with unique values
        const uniquePostIds = postIds.filter(
            (e, i, self) => i === self.indexOf(e));

        expect(res.statusCode).toBe(200);
        expect(uniquePostIds.length).toBe(1);
        expect(uniquePostIds[0]).toEqual(resBody[0].postId);
    });
});