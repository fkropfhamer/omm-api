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

    test('get meme meme found', (done) => {
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
});
