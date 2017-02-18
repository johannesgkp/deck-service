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
	
    let dataPost = {
        title: 'Dummy',
        content: 'dummy',
        language: 'en',
        license: 'CC0',
        user: '1',
        root_deck: '25-1'
    };
    let options = {
        method: 'GET',
        url: '/slide/',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let optionsPost = {
        method: 'POST',
        url: '/slide/new',
        headers: {
            'Content-Type': 'application/json'
        }
	}
	
    context('when trying to get a slide it', () => {
        it('should reply informations for an existing slide(contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {id: ''};
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = dataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.language.should.equal('en');
                payload.license.should.equal('CC0');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.user.should.equal(1);	
				console.log('payload.id');
				console.log(payload.id);
				opt.payload.id = payload.id;
				console.log('opt.payload.id');
				console.log(opt.payload.id);
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
				console.log('opt.payload.id');
				console.log(opt.payload.id);
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload2 = JSON.parse(response.payload);
                payload2.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload2.language.should.equal('en');
                payload2.license.should.equal('CC0');
                payload2.lastUpdate.should.equal(payload2.timestamp);
                payload2.user.should.equal(1);
            });
        });
		
        it('should reply informations for an existing slide with full informations (contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {//TODO
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {id: ''};
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = dataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.language.should.equal('en');
                payload.license.should.equal('CC0');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.user.should.equal(1);
				opt.payload.id = payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload2 = JSON.parse(response.payload);
                payload2.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload2.language.should.equal('en');
                payload2.license.should.equal('CC0');
                payload2.lastUpdate.should.equal(payload2.timestamp);
                payload2.user.should.equal(1);
            });
        }); 
		
		it('should reply 404 for a not existing slide', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {id: '9989'};
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(404);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.contain.keys('statusCode', 'error', 'message');
                payload.error.should.equal('Not Found');
            });
        });
		
		it('should reply 400 if the id is not an id', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {id: 'notAnId'};
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
	});
});
