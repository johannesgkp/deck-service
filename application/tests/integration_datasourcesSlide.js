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
            dataSources: [{
            type: 'type',
            title: 'title'
        }]
    };
	
    let fullData = {
            dataSources: [{
            type: 'type',
            title: 'title',
            url: 'wikipedi.org',
            comment: 'comment',
            authors: 'authors',
            year: '2000'
        }]
    };
    let minimalDataPost = {
        content: 'dummy',
        license: 'CC0',
        user: '1',
        root_deck: '25-1'
    };
    let options = {
        method: 'PUT',
        url: '/slide/datasources/',
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
	
    context('when adding datasources to a slide it', () => {
        it('should reply 200 for minimalData', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData;
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('array');
            });
        }); 
		
        it('should reply 200 for fullData', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('array');
            });
        }); 
		
        it('should reply 400 for if type is missing', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                dataSources: [{
			        //type: 'type',
                    title: 'title'
                }]
            };
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
        it('should reply 400 for if title is missing', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = {
                dataSources: [{
					//title: 'title',
                    type: 'type'
                }]
            };
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
        it('should reply 400 if type is not a valid type', () => {//TODO
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
			opt.payload.dataSources.type = 'notAValidType';
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
        it('should reply 400 if url is not a valid url', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
			opt.payload.dataSources.url = 'notAValidUrl';
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
        it('should reply 400 if year is not a valid year', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = fullData;
			opt.payload.dataSources.year = 'notAValidYear';
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
		it('should reply 404 for a not existing slide', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData; 
			opt.url ='/slide/datasources/9001';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(404);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Not Found');
            });
        });
		
		it('should reply 400 if the id is not an id', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData; 
			opt.url ='/slide/datasources/notAnId';
            return server.inject(opt).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        }); 
		
        it('should reply 400 if the datasources is not an array', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData;
            opt.payload.dataSources = 'notAnArray'; 
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt);
            }).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(400);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('statusCode', 'error', 'message', 'validation');
                payload.error.should.be.a('string').and.equal('Bad Request');
            });
        });
		
        it('should reply 400 if the datasources is empty', () => {
            let opt = JSON.parse(JSON.stringify(options));
            opt.payload = minimalData;
            opt.payload.dataSources = []; 
            let optP = JSON.parse(JSON.stringify(optionsPost));
            optP.payload = minimalDataPost;
            return server.inject(optP).then((response) => {
                response.should.be.an('object').and.contain.keys('statusCode','payload');
                response.statusCode.should.equal(200);
                response.payload.should.be.a('string');
                let payload = JSON.parse(response.payload);
                payload.should.be.an('object').and.contain.keys('contributors', 'id', 'lastUpdate', 'license', 'revisions', 'timestamp', 'user');
				opt.url += payload.id;
            }).then(() => {
                return server.inject(opt)
            }).then((response) => {
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
