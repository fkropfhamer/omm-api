import app from '../src/app';
import request from 'supertest'
import mockingoose from 'mockingoose';
import Meme from '../src/models/meme';

describe('app', () => {
    test('status page works', (done) => {
        request(app).get("/api/v1/")
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({status: 'ok'})
                done();
            });
    });

    test('get meme meme not found', (done) => {
        mockingoose(Meme).toReturn(null, 'findOne');

        request(app).get("/api/v1/meme/search/test")
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: false,
                    message: "meme not found",
                });
                done();
            })
    })

    test('get meme found', (done) => {
        const mockMeme = {
            id: "1234",
            likes: 3
        }

        mockingoose(Meme).toReturn(mockMeme, 'findOne');

        request(app).get("/api/v1/meme/search/test")
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: true,
                    data: {
                        meme: mockMeme
                    },
                });
                done();
            })
    })

    test('like meme, meme not found', (done) => {
        mockingoose(Meme).toReturn(null, 'findOne');

        request(app).post("/api/v1/meme/like")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: false,
                    message: "meme not found :(",
                });
                done();
            })
    })

    test('like meme, meme found', (done) => {
        const mockMeme = {
            likes: 0
        }

        mockingoose(Meme).toReturn(mockMeme, 'findOne');

        request(app).post("/api/v1/meme/like")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: true,
                    message: "meme liked",
                });
                done();
            })
    })

    test('dislike meme, meme not found', (done) => {
        mockingoose(Meme).toReturn(null, 'findOne');

        request(app).post("/api/v1/meme/dislike")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: false,
                    message: "meme not found :(",
                });
                done();
            })
    })

    test('dislike meme, meme found', (done) => {
        const mockMeme = {
            likes: 0,
            dislikes: 3
        }

        mockingoose(Meme).toReturn(mockMeme, 'findOne');

        request(app).post("/api/v1/meme/dislike")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: true,
                    message: "meme disliked",
                });
                done();
            })
    })

    test('comment meme, meme not found', (done) => {
        mockingoose(Meme).toReturn(null, 'findOne');

        request(app).post("/api/v1/meme/comment")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: false,
                    message: "meme not found :(",
                });
                done();
            })
    })

    test('like meme, meme found', (done) => {
        const mockMeme = {
            likes: 0,
            comments: []
        }

        mockingoose(Meme).toReturn(mockMeme, 'findOne');

        request(app).post("/api/v1/meme/comment")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({
                    status: true,
                    message: "comment saved",
                });
                done();
            })
    })
});
