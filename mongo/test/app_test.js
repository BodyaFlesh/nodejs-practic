const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('The express app', () => {
    it('handless a GET request to /api', (done) => {
        request(app)
            .get('/api')
            .end((err, response) => {
                //console.log(response);
                assert(response.body.hi === 'there');
                done();
            });
    })

});