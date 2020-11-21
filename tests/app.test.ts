import app from '../src/app';
import request from 'supertest'

describe('app', () => {
    it('returns json', (done) => {
        request(app).get("/api/v1/")
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).toMatchObject({status: 'ok'})
                done();
            });
    });
});
