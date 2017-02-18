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

    let dataPut = {
        title: 'new title',
        content: 'new content',
        //speakernotes: 'new speakernotes',
        //user: '1',
        //root_deck: '25-1',
        //comment: 'new comment',
        //description: 'new description',
        //tags: ['newTag1', 'newTag2'],
		//position: '1',
        //language: 'de',
        //license: 'CC1',
        //dataSources: []
    };
    let fullData = {
        title: 'new title',
        content: 'new content',
        speakernotes: 'new speakernotes',
        user: '1',
        root_deck: '25-1',
        top_root_deck: '',
        parent_deck: {
            id: '',
            revision: 'new revision'
        },
        parent_slide: {
            id: '',
            revision: 'new revision'
        },
        comment: 'new comment',
        description: 'new description',
        tags: ['newTag1', 'newTag2'],
        position: '',
        language: 'de',
        license: 'CC1',
        dataSources: ['wikipedia.org']
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
    let fullDataPost = {
        title: 'title',
        content: 'content',
        speakernotes: 'speakernotes',
        user: '1',
        root_deck: '25-1',
        top_root_deck: '',
        parent_deck: {
            id: '',
            revision: 'revision'
        },
        parent_slide: {
            id: '',
            revision: 'revision'
        },
        comment: 'comment',
        description: 'description',
        tags: [],
        position: '',
        language: 'en',
        license: 'CC0',
        dataSources: []
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
	
    context('when changing data from a slide it', () => {
        it('should change the data for an existing slide', () => {
            let opt = JSON.parse(JSON.stringify(optionsPut));
            opt.payload = dataPut;
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = dataPost;
            let optG = JSON.parse(JSON.stringify(optionsGet));
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
				opt.url += payload.id;
				optG.url += payload.id;
            }).then(() => {
			    //PUT
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'description', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				payload.description.should.equal('new descriptionString');
				payload.language.should.equal('de');
				payload.license.should.equal('CC1');
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
