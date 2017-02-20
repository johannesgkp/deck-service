/* eslint dot-notation: 0, no-unused-vars: 0 */
'use strict';

describe('REST API', () => {

    let server;

    beforeEach((done) => {
        //Clean everything up before doing new tests
        Object.keys(require.cache).forEach((key) => delete require.cache[key]);
        require('chai').should();
        let hapi = require('hapi');
        server = new hapi.Server();
        server.connection({
            host: 'localhost',
            port: 3000
        });
        require('../routes.js')(server);
        done();
    });

    let options = {
        method: 'GET',
        url: '/alldecks/',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when trying to get all decks it', () => {//TODO
        it('should reply an array containing all decks from a specific user', () => {
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += 1;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
            });
        });
		
        it('should reply 404 for a not existing user id', () => {
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += 9989;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(404);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.contain.keys('statusCode', 'error', 'message');
                payload.error.should.equal('Not Found');
            });
        });
		
        it('should reply 400 for wrong type of id', () => {//QUESTION or 404?
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += 'notAnId';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.contain.keys('statusCode', 'error', 'message');
                payload.error.should.equal('Bad Request');
            });
        });

	});
});
