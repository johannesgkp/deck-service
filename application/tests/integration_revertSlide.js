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
	
   let dataPut = {
        title: 'new title',
        content: 'new content',
        //speakernotes: 'new speakernotes',
        user: '1',
        root_deck: '25-1',
        //comment: 'new comment',
        //description: 'new description',
        //tags: ['newTag1', 'newTag2'],
		//position: '1',
        //language: 'de',
        //license: 'CC1',
        //dataSources: []
    };
    let dataPost = {
        title: 'old title',
        content: 'old content',
		speakernotes: 'old speakerNotes',
        language: 'en',
        license: 'CC0',
        user: '1',
        root_deck: '25-1',
		comment: 'old commentString',
		description: 'old descriptionString',
		tags: ['oldTag1', 'oldTag2']
    };
	let data = {
		id: 1,
		user: 1,
		//root_deck: ''
	};
    let optionsPut = {
        method: 'PUT',
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
    };
    let optionsGet = {
        method: 'GET',
        url: '/slide/',
        headers: {
            'Content-Type': 'application/json'
        }
    }; 
	let options = {
        method: 'POST',
        url: '/slide/revert/',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when reverting a slide it', () => {
        it('should revert the slide', () => {
            let optPu= JSON.parse(JSON.stringify(optionsPut));
            optPu.payload = dataPut;
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = dataPost;
            let optG = JSON.parse(JSON.stringify(optionsGet));
            let optR = JSON.parse(JSON.stringify(options));
			optR.payload = data;
			//POST
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'description', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				payload.description.should.equal('old descriptionString');
				payload.language.should.equal('en');
				payload.license.should.equal('CC0');
                payload.user.should.equal(1);
				optPu.url += payload.id;
				optG.url += payload.id;
				optR.url += payload.id;
            }).then(() => {
			    //PUT
                return server.inject(optPu);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
				console.log(payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'description', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				payload.description.should.equal('new descriptionString');
				payload.language.should.equal('de');
				payload.license.should.equal('CC1');
                payload.user.should.equal(1);
            }).then(() => {
			    //revert
                return server.inject(optR);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
				console.log(payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.license.should.equal('CC0');
                payload.user.should.equal(1);
            
            }).then(() => {
			    //GET
                return server.inject(optG);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(2020);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.license.should.equal('CC0');
                payload.user.should.equal(1);
            });
        }); 
	});
});
