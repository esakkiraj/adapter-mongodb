const MClient = require('mongodb').MongoClient;

const collectionName = 'ma-events';
const URL = process.env.MAA_MONGODB_URL;

let DB;


async function getMACollection() {
  if(!DB) {
    DB = await MClient.connect(URL); 
  }
  return DB.collection(collectionName);
}

function get(key, options) {

  return getMACollection()
    .findOne({ pathname: `${key}` }, { fields: { views: 1 } })
    .then((doc) =>  {

        const viewsArray = (doc.views || []).filter((view) => {
          if(options && options.filter && options.filter.before && view.time > options.before ) return false;
          if(options && options.filter && options.filter.after && view.time < options.after ) return false;
          return true;
        });
      
      return { views: viewsArray };
    });
}
function put(key, value) {
  if( value.views.length <= 1 ) {
    return getMACollection().insertOne({ pathname: `${key}`, views: value.views });
  }

  return getMACollection().updateOne({ pathname: `${key}` }, { $set : { views: value.views } });
}
async function getAll(options) {
  const paths = await keys();
  const eventStats = {};

  for(let i=0;i<paths.length;i++) {
    const path = paths[i];

    if( !options || (options && ((options.pathname && path.startsWith(options.pathname)) || !options.pathname)) ) {
      eventStats[path] = await put(path, { filter: options.filter });
    }
  }

  return eventStats;
}
function has(key) {
  return getMACollection().find({ pathname: `${key}` }).toArray().then(function(docs) { return Array.isArray(docs) && !!docs.length; });
}
function keys() {
  return getMACollection().find({}).toArray().then(function(events) { return events.map((event) => event.pathname); });
}

function deleteAll() {
  return getMACollection.deleteMany({});
}
function close() {
  return DB.close();
}
module.exports = {
  get,
  put,
  getAll,
  has,
  keys,

  deleteAll,
  close
};
