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
    let dataPutSource = {
            dataSources: [{
            type: 'type',
            title: 'title',
            url: 'wikipedi.org',
            comment: 'comment',
            authors: 'authors',
            year: '2000'
        }]
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
    let optionsPutSource = {
        method: 'PUT',
        url: '/slide/datasources/',
        headers: {
            'Content-Type': 'application/json'
        }
    };
	
    context('when trying to get a slide it', () => {
        it('should reply informations for an existing slide(contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {
            let opt = JSON.parse(JSON.stringify(options));
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
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'description', 'language', '_id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.contributors.should.be.an('array');
                payload.contributors[0].should.be.an('object').and.contain.keys('user', 'count');
                payload.description.should.equal('descriptionString');
                payload.language.should.equal('en');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.license.should.equal('CC0');
				
                payload.revisions.should.be.an('array');
                payload.revisions[0].should.be.an('object').and.contain.keys('id', 'usage', 'timestamp', 'user', 'title', 'content', 'speakernotes', 'parent', 'tags', 'license');
                payload.revisions[0].id.should.equal(1);
                payload.revisions[0].usage.should.be.an('array');
                payload.revisions[0].usage[0].should.be.an('object').and.contain.keys('id', 'revision');
                payload.revisions[0].timestamp.should.equal(payload.timestamp);
				console.log('XXXXXXXXXXXXXXXXXX');
				console.log(payload.revisions[0].timestamp);
                payload.revisions[0].user.should.equal(1);
                payload.revisions[0].title.should.equal('title');
                payload.revisions[0].content.should.equal('content');
                payload.revisions[0].speakernotes.should.equal('speakerNotes');
                //payload.revisions[0].parent.should.equal(null);
                payload.revisions[0].tags.should.eql(['tag1', 'tag2']);
                payload.revisions[0].license.should.equal('CC0');
				
                payload.user.should.equal(1);
            });
        });

        it('should reply informations for an existing slide with full informations (contributors, id, lastUpdate, license, revisions, timestamp, user)', () => {//TODO
            let opt = JSON.parse(JSON.stringify(options));
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
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'description', 'language', '_id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
                payload.contributors.should.be.an('array');
                payload.contributors[0].should.be.an('object').and.contain.keys('user', 'count');
                payload.description.should.equal('descriptionString');
                payload.language.should.equal('en');
                payload.lastUpdate.should.equal(payload.timestamp);
                payload.license.should.equal('CC0');
				
                payload.revisions.should.be.an('array');
                payload.revisions[0].should.be.an('object').and.contain.keys('id', 'usage', 'timestamp', 'user', 'title', 'content', 'speakernotes', 'parent', 'tags', 'license');
                payload.revisions[0].id.should.equal(1);
                payload.revisions[0].usage.should.be.an('array');
                payload.revisions[0].usage[0].should.be.an('object').and.contain.keys('id', 'revision');
                payload.revisions[0].timestamp.should.equal(payload.timestamp);
                payload.revisions[0].user.should.equal(1);
                payload.revisions[0].title.should.equal('title');
                payload.revisions[0].content.should.equal('content');
                payload.revisions[0].speakernotes.should.equal('speakerNotes');
                //payload.revisions[0].parent.should.equal(null);
                payload.revisions[0].tags.should.eql(['tag1', 'tag2']);
                payload.revisions[0].license.should.equal('CC0');
				
                payload.user.should.equal(1);
            });
        }); 

        it('should reply informations including dataSources if dataSources have been put', () => {
            let opt = JSON.parse(JSON.stringify(options));
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = dataPost;
            let optPutSource = JSON.parse(JSON.stringify(optionsPutSource));
            optPutSource.payload = dataPutSource;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'language', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
				optPutSource.url += payload.id;
            }).then(() => {
                return server.inject(optPutSource);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
			}).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('dataSources');
            });
        }); 
		
		it('should reply 404 for a not existing slide', () => {
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += '9989';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(404);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.contain.keys('statusCode', 'error', 'message');
                payload.error.should.equal('Not Found');
            });
        });
		
		it('should reply 400 if the id is not an id', () => {//QUESTION or is 404 better? since the id is in the path
            let opt = JSON.parse(JSON.stringify(options));
			opt.url += 'notAnId';
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
