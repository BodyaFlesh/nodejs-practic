const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const driver = mongoose.model('driver');

describe('Drivers controller', () => {
    it('Post to /api/drivers creates a new driver', (done) => {
        driver.count()
        .then(count => {
            request(app)
                .post('./api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    driver.count().then(newCount => {
                        assert(count + 1 === newCount);
                    });
                    done();
                });
        });
    });
})