/*
Controller for handling mongodb and the data model slide while providing CRUD'ish.
*/

'use strict';

const helper = require('./helper'),
  slideModel = require('../models/slide.js'),
  oid = require('mongodb').ObjectID;

module.exports = {
  get: function(identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => col.findOne({
        _id: oid(identifier)
      }));
  },

  insert: function(slide) {
    //TODO check for root and parent deck ids to be existant, otherwise create these
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => {
        let valid = false;
        const convertedSlide = convertToNewSlide(slide);
        try {
          valid = slideModel(convertedSlide);

          if (!valid) {
            return slideModel.errors;
          }

          return col.insertOne(convertedSlide);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      }); //id is created and concatinated automatically
  },

  replace: function(id, slide) {
    return helper.connectToDatabase()
      .then((db) => db.collection('slides'))
      .then((col) => {
        return col.findOne({_id: oid(id)}, {fields:{revisions:1}})
          .then((existingSlide) => {
            const maxRevisionId = existingSlide.revisions.reduce((prev, curr) => {
              if (curr > prev)
                return curr;

              return prev;
            }, 1);

            let valid = false;
            const slideWithNewRevision = convertDummySlideWithNewRevision(slide, maxRevisionId+1 );
            try {
              valid = slideModel(slideWithNewRevision);

              if (!valid) {
                return slideModel.errors;
              }

              return col.findOneAndUpdate({
                _id: oid(id)
              }, { $push: { revisions: slideWithNewRevision.revisions[0] } });
            } catch (e) {
              console.log('validation failed', e);
            }
            return;
          });
      });
  }
};

function convertToNewSlide(slide) {
  let now = new Date();
  const result = {
    user: slide.user,
    deck: slide.root_deck,
    timestamp: now.toISOString(),
    language: slide.language,
    revisions: [{
      id: 1,
      title: slide.title,
      timestamp: now.toISOString(),
      user: slide.user,
      license: slide.license,
      content: slide.content,
      parent: slide.parent_slide
    }]
  };
  //console.log('from', slide, 'to', result);
  return result;
}

function convertDummySlideWithNewRevision(slide, newRevisionId) {
  let now = new Date();
  const result = {
    user: slide.user,
    deck: slide.root_deck,
    timestamp: now.toISOString(),
    language: slide.language,
    revisions: [{
      id: newRevisionId,
      title: slide.title,
      timestamp: now.toISOString(),
      user: slide.user,
      license: slide.license,
      content: slide.content,
      parent: slide.parent_slide
    }]
  };
  //console.log('from', slide, 'to', result);
  return result;
}
