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

    let minimalData = {
        content: 'dummy',
        license: 'CC0',
        user: '1',
        root_deck: '25-1'
    };
    let middleData = {
        title: 'Dummy',
        content: 'dummy',
		speakernotes: 'dummy speakerNotes',
        language: 'en',
        license: 'CC0',
        user: '1',
        root_deck: '25-1',
		comment: 'dummy commentString',
		description: 'dummy descriptionString',
		tags: ['tag1', 'tag2']
    };
	let fullData = {
        title: 'Dummy',
        content: 'dummy',
		speakernotes: 'dummy speakerNotes',
        language: 'en',
        license: 'CC0',
        user: '1',
        root_deck: '25-1',
		parent_deck: {id: 'string', revision: 'string'},
		parent_slide: {id: 'string', revision: 'string'},
		position: 'string',
		comment: 'dummy commentString',
		description: 'dummy descriptionString',
		tags: [],
    };
    let options = {
        method: 'POST',
        url: '/slide/new',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when creating a slide it', () => {
        it('should reply informations for the minimal Data(contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.license.should.equal('CC0');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.user.should.equal(1);
            });
        }); 
		
		it('should reply informations for "middle"-Data (contributors, id, language, lastUpdate, license, revisions, timestamp, user )', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.language.should.equal('en');
                payload.license.should.equal('CC0');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.user.should.equal(1);
            });
        });
				
		it('should reply informations for the full Data (contributors, id, language, lastUpdate, license, revisions, timestamp, user )', () => {//TODO
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.language.should.equal('en');
                payload.license.should.equal('CC0');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.user.should.equal(1);
            });
        });
		
        it('should return 400 about missing of parameters from minimalData(no content)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                //content: 'dummy',
                license: 'CC0',
                user: '1',
                root_deck: '25-1'
            };
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
        it('should return 400 about missing of parameters from minimalData(no license)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                content: 'dummy',
                //license: 'CC0',
                user: '1',
                root_deck: '25-1'
            };
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
        it('should return 400 about missing of parameters from minimalData(no user)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                content: 'dummy',
                license: 'CC0',
                //user: '1',
                root_deck: '25-1'
            };
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
        it('should return 400 about missing of parameters from minimalData(no root_deck)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                content: 'dummy',
                license: 'CC0',
                user: '1',
                //root_deck: '25-1'
            };
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
		it('it should return 400 in case the language parameter is not a language', () => {//QUESTION Or Unprocessable Entity 422 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.language = 'notALanguage';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
		it('it should return 400 in case the license parameter is not a license', () => {//QUESTION Or Unprocessable Entity 422 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.license = 'notALicense';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });	
		
		it('it should return 400 in case the user parameter is not a user(number)', () => {//QUESTION Or Unprocessable Entity 422 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.user = 'notAUser';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });	
		
		it('it should return 400 in case the root_deck parameter is not a root_deck(number-number)', () => {//QUESTION Or Unprocessable Entity 422 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.root_deck = 'notARoot_deck';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
    		
		it('it should return 400 in case the user doesnt exist', () => {//QUESTION Or 404 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.user = '2';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
	
		it('it should return 400 in case the root_deck doesnt exist', () => {//QUESTION Or 404 ?
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = middleData;
			opt.payload.root_deck = '23-1';
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
