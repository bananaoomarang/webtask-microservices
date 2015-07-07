'use latest';

var { MongoClient, ObjectId } = require('mongodb');
var assign                    = require('object-assign');

const COLLECTION = 'posts';

const ACTIONS = {
  SAVE(action, cb) {
    if(!action.doc) cb(new Error('Must supply doc to save.'));

    action.db
      .collection(COLLECTION)
      .insertOne(action.doc, (err, result) => {
        if(err) cb(err);

        cb(null, result);
      });
  },
  GET(action, cb) {
    if(!action.id) cb(new Error('Must supply id to get.'));

    action.db
      .collection(COLLECTION)
      .findOne({ _id: ObjectId(action.id) }, (err, post) => {
        if(err) return cb(err);

        cb(null, post);
      });
  },
  QUERY(action, cb) {
    action.db
      .collection(COLLECTION)
      .find(action.query || null)
      .toArray((err, result) => {
        if(err) return cb(err);

        cb(null, result);
      })
  }
}

return (ctx, done) => {
  console.log(ctx.data);
  if(!ctx.data.MONGO_URL) done(new Error('Please provide database URL.'));
  if(!ctx.data.type) done(new Error('Please provide a type.'));

  connect_to_db(ctx.data.MONGO_URL)
    .then(db   => {
      const action = assign(ctx.data, { db });

      return call_action(action);
    })
    .then(result => done(null, result))
    .catch(err   => done(err));
};

function connect_to_db(url) {
  return new Promise( (resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if(err) return reject(err);

      resolve(db);
    });
  });
}

function call_action(action) {
  return new Promise( (resolve, reject) => {

    try {
      ACTIONS[action.type](action, (err, result) => {
        if(err) return reject(err);

        resolve(result);
      }); 
    }
    catch(e) {
      reject(e);
    }

  });

}
