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

    let minimalData = {
        //description: 'description',
        language: 'en',
        translation: {
           status: 'original'
        },
        //tags: [],
        title: 'title',
        user: '1',
        root_deck: '25', // must only contain alpha-numeric characters
        //parent_deck: {
        //    id: 'string',
        //    revision: 'string'
        //},
        //abstract: 'abstract',
        //comment: 'comment',
        //footer: 'footer',
        first_slide: {
            content: 'first_slide content',
            title: 'first_slide',
            speakernotes: 'speakernotes'
        },
        license: 'CC0'
    };
	let fullData = {
        description: 'description',
        language: 'en',
        translation: {
           status: 'original'
        },
        tags: ['tag1', 'tag2'],
        title: 'title',
        user: '1',
        root_deck: '25',
        /*
		parent_deck: {
            id: '25-1',
            revision: 'string'
        },
		*/
        //abstract: 'abstract',
        comment: 'comment',
        footer: 'FOOTER',
        first_slide: {
            content: 'first_slide content',
            title: 'first_slide',
            speakernotes: 'speakernotes'
        },
        license: 'CC0'
    };
	
    let options = {
        method: 'POST',
        url: '/deck/new',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when creating a deck it', () => {
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
		/*
        it('should reply informations for the full Data(contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
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
		*/
	});
});
