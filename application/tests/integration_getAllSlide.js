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
        url: '/allslide',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when trying to get all slides it', () => {
        it('should reply an array containing all slides', () => {
            let opt = JSON.parse(JSON.stringify(options));
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('array');
                payload[0].should.be.an('object').and.contain.keys('contributors', 'description', 'language', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload[0].contributors.should.be.an('array');
                payload[0].contributors[0].should.be.an('object').and.contain.keys('user', 'count');
                payload[0].revisions.should.be.an('array');
                payload[0].revisions[0].should.be.an('object').and.contain.keys('id', 'usage', 'timestamp', 'user', 'title', 'content', 'speakernotes', 'parent', 'tags', 'license');
            });
        });

	});
});
