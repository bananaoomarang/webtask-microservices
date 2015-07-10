'use latest';

var { MongoClient, ObjectId } = require('mongodb');
var assign                    = require('object-assign');
var express                   = require('express');
var { fromExpress }           = require('webtask-tools');

const app        = express();
const COLLECTION = 'posts';

function get_collection(url) {
  return new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if(err) return reject(err);

      resolve(db.collection(COLLECTION));
    });
  });
}

app.get('*', function (req, res) {
  if(!req.webtaskContext.data.id)
    res
      .status(400)
      .end('Must supply id to get.');

  const id = req.webtaskContext.data.id;

  get_collection(req.webtaskContext.data.MONGO_URL)
    .then(collection => get_post(id, collection))
    .then(post       => res.status(200).json(post))
    .catch(err       => res.status(500).end('Error: ' + err.message));
});

app.post('*', function (req, res) {
  if(!req.webtaskContext.data.title  ||
     !req.webtaskContext.data.byline ||
     !req.webtaskContext.data.body) 
    res
      .status(400)
      .end('Must supply title, byline & body.');

      const doc = {
        title: req.webtaskContext.data.title,
        byline: req.webtaskContext.data.byline,
        body: req.webtaskContext.data.body
      }

  get_collection(req.webtaskContext.data.MONGO_URL)
    .then(collection => save_post(doc, collection))
    .then(post       => res.status(200).json(post))
    .catch(err       => res.status(500).end('Error: ' + err.message));
});

app.patch('*', function (req, res) {
  if(!req.webtaskContext.data.id ||
     !req.webtaskContext.data.update) 
    res
      .status(400)
      .end('Must supply id & update.');

  const id = req.webtaskContext.data.id;
  const update = req.webtaskContext.data.update;

  get_collection(req.webtaskContext.data.MONGO_URL)
    .then(collection => update_post(id, update, collection))
    .then(post       => res.status(200).json(post))
    .catch(err       => res.status(500).end('Error: ' + err.message));
});

app.del('*', function (req, res) {
  if(!req.webtaskContext.data.id) 
    res
      .status(400)
      .end('Must supply id.');

  const id = req.webtaskContext.data.id;

  get_collection(req.webtaskContext.data.MONGO_URL)
    .then(collection => delete_post(id, collection))
    .then(post       => res.status(200).json(post))
    .catch(err       => res.status(500).end('Error: ' + err.message));
});

function get_post(id, collection) {
  return new Promise( (resolve, reject) => {
    collection
      .findOne({ _id: ObjectId(id) }, (err, post) => {
        if(err) return reject(err);

        resolve(post);
      });
    });
}

function save_post(doc, collection) {
  return new Promise( (resolve, reject) => {
    collection
      .insertOne(doc, (err, result) => {
        if(err) return reject(err);

        resolve(result);
      });
  });
}


function update_post(id, update, collection) {
  return new Promise( (resolve, reject) => {
    collection
      .updateOne({ _id: ObjectId(id) }, update, (err, updated) => {
        if(err) return reject(err);

        resolve(updated);
      });
    });
}

function delete_post(id, collection) {
  return new Promise( (resolve, reject) => {
    collection
      .deleteOne({ _id: ObjectId(id) }, (err, deleted) => {
        if(err) return reject(err);

        resolve(deleted);
      });
    });
}

module.exports = fromExpress(app);
