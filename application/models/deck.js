'use strict';

//require
let Ajv = require('ajv');
let ajv = Ajv({
    verbose: true,
    allErrors: true
    //v5: true  //enable v5 proposal of JSON-schema standard
}); // options can be passed, e.g. {allErrors: true}

//build schema
const objectid = {
    type: 'integer',
    maxLength: 24,
    minLength: 1
};

//build schema
const contentItem = {
    type: 'object',
    properties: {
        order: {
            //type: 'string'
            type: 'number',
            minimum: 1
        },
        kind: {
            type: 'string',
            enum: ['deck', 'slide']
        },
        ref: {
            type: 'object',
            properties: {
                id: objectid,
                revision: {
                    type: 'number',
                    minimum: 1
                } //if not given use the last revision
            },
            required: ['id']
        }
    },
    required: ['kind', 'ref']
};
const deckRevision = {
    type: 'object',
    properties: {
        id: { //increment with every new revision
            type: 'number',
            minimum: 1
        },
        title: {
            type: 'string'
        },
        timestamp: {
            type: 'string',
            format: 'datetime'
        },
        user: objectid,
        parent: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer'
                },
                revision: {
                    type: 'integer'
                }
            }
        },
        language: {
            type: 'string'
        },
        license: {
            type: 'string',
            enum: ['CC0', 'CC BY', 'CC BY-SA']
        },
        popularity: {
            type: 'number',
            minimum: 0
        },
        theme: {
            type: 'object',
            properties: {
                default: objectid
            }
        },
        transition: {
            type: 'object',
            properties: {
                default: objectid
            }
        },
        comment: {
            type: 'string'
        }, //revision comment
        abstract: {
            type: 'string'
        },
        footer: {
            type: 'string'
        },
        isFeatured: {
            type: 'number'
        },
        priority: {
            type: 'number'
        },
        visibility: {
            type: 'boolean'
        },
        tags: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        preferences: {
            type: 'array',
            items: {
                type: 'object'
            }
        },
        contentItems: {
            type: 'array',
            items: contentItem
        },
        dataSources: { //is filled out automatically from the slides
            type: 'array',
            items: {
                type: 'string'
            }
        },
        usage: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: objectid,
                    revision: {
                        type: 'number'
                    }
                }
            }
        },
        translated_from: { //if this deck_revision is a result of translation
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['original', 'google', 'revised', null]
                },
                source: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number'
                        },
                        revision: {
                            type: 'number'
                        }
                    }
                },
                translator: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                        },
                        username:{
                            type: 'string'
                        }
                    }

                }
            }
        },
    },
    required: ['id', 'timestamp', 'user', 'license']
};

const deck = {
    type: 'object',
    properties: {
        timestamp: {
            type: 'string',
            format: 'datetime'
        },
        user: objectid,
        description: {
            type: 'string'
        },
        lastUpdate: { //timestamp of last slide revision
            type: 'string',
            format: 'datetime'
        },
        revisions: {
            type: 'array',
            items: deckRevision
        },
        tags: { //here or in revisions?
            type: 'array',
            items: {
                type: 'string'
            }
        },
        active: objectid,
        datasource: {
            type: 'string'
        },
        translations: { //put here all translations explicitly - deck ids
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    language: {
                        type: 'string'
                    },
                    deck_id: object_id
                }
            }
        },
        translated_from: { //if this deck is a result of translation
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['original', 'google', 'revised', null]
                },
                source: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number'
                        },
                        revision: {
                            type: 'number'
                        }
                    }
                },
                translator: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                        },
                        username:{
                            type: 'string'
                        }
                    }
                }
            }
        },
    },
    required: ['timestamp', 'user']
};

//export
module.exports = ajv.compile(deck);
