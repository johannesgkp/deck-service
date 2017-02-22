/* eslint dot-notation: 0, no-unused-vars: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

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

    let data = {//TODO
        selector: {
            id: 'string',
            spath: 'string',
            stype: 'string',
            sid: 'string'
        },
        nodeSpec: {
            id: 'string',
            type: 'string'
        },
        user: 'string',
        content: 'string',
        title: 'string',
        license: 'string',
        speakernotes: 'string'
    };
    let options = {
        method: 'POST',
        url: '/decktree/node/create',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when creating a decktree it', () => {//TODO
        it('should reply 200', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = data;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
            });
        }); 
		
	});
});
