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
        url: '/allrecent/',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when trying to get all featured it', () => {
        it('should reply an array containing all recent', () => {//TODO make decks
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += '0/0';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('array');
            });
        });

	});
});
