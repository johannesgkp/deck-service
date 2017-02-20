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
        title: 'title',
        content: 'content',
		speakernotes: 'speakerNotes',
        language: 'en',
        license: 'CC0',
        user: '1',
        root_deck: '25-1',
		comment: 'commentString',
		description: 'descriptionString',
		tags: ['tag1', 'tag2']
    };
    let optionsGet = {
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
	
    context('when trying to get the revisionCount of a slide it', () => {
        it('should reply 1 for a new slide', () => {
            let optG = JSON.parse(JSON.stringify(optionsGet));
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
				optG.url += (payload.id + '/revisionCount');
            }).then(() => {
                return server.inject(optG);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
				payload.should.equal(1);
            });
        });
		
        it('should reply 404 if the id doesnt exist', () => {
            let optG = JSON.parse(JSON.stringify(optionsGet));
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
				optG.url += '9989/revisionCount';
            }).then(() => {
                return server.inject(optG);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(404);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.contain.keys('statusCode', 'error', 'message');
                payload.error.should.equal('Not Found');
            });
        });
		
        it('should reply 400 if the id is not an id', () => {//QUESTION or 404
            let optG = JSON.parse(JSON.stringify(optionsGet));
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
				optG.url += 'notAnId/revisionCount';
            }).then(() => {
                return server.inject(optG);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
        it('should reply 2 for a slide that hase been changed onetime', () => {//TODO
        });
        it('should reply 1 for a slide that hase been changed and than reverted', () => {//TODO
        });

	});
});
