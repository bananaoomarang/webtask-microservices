"use latest";

var { MongoClient } = require('mongodb');

return ({ data }, req, res) => {
  const { MONGO_URL, title, byline, body } = data;

  const doc = {
    title,
    byline,
    body
  };

  connectToDb(MONGO_URL)
    .then(db     => save(doc, db))
    .then(result => done(null, result))
    .catch(err   => done(err));
}

function connectToDb(url) {
  return new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if(err) return reject(err);

      resolve(db);
    });
  });
}

function save(doc, db) {
  return new Promise( (resolve, reject) => {
    db
      .collection('posts')
      .insertOne(doc, (err, result) => {
        if(err) return reject(err);

        resolve(null, result);
      })
  });
}
