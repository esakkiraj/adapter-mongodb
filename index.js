const MClient = require('mongodb').MongoClient;

const collectionName = process.env.MAA_MONGODB_COLLECTION_NAME || 'ma-events';
const URL = process.env.MAA_MONGODB_URL;

let DB;

async function getMACollection() {
  if(!DB) {
    DB = await MClient.connect(URL);
  }
  return await DB.collection(collectionName);
}

async function get(key, options) {
  
  const collection = await getMACollection();
  const doc = await collection.findOne({ pathname: `${key}` }, { fields: { views: 1 } });
  const views = (doc && doc.views ? doc.views : []).filter((view) => {
    if(options && options.before && view.time > options.before ) return false;
    if(options && options.after && view.time < options.after ) return false;
    return true;
  });
      
  return { views };
}
async function put(key, value) {

  const collection = await getMACollection();
  if( value.views.length <= 1 ) {
    return collection.insertOne({ pathname: `${key}`, views: value.views });
  }

  return collection.updateOne({ pathname: `${key}` }, { $set : { views: value.views } });
}
async function getAll(options) {

  const paths = await keys();
  const eventStats = {};

  for(let i=0;i<paths.length;i++) {
    const path = paths[i];

    if( !options || (options && ((options.pathname && path.startsWith(options.pathname)) || !options.pathname)) ) {
      eventStats[path] = await get(path, { before: options.before, after: options.after });
    }
  }

  return eventStats;
}
async function has(key) {

  const collection = await getMACollection();
  const doc = await collection.find({ pathname: `${key}` }).toArray();

  return Array.isArray(doc) && !!doc.length; 
}
async function keys() {

  const collection = await getMACollection();
  const docs = await collection.find({}).toArray();

  return (docs || []).map((doc) =>  { return doc.pathname; });
}

module.exports = {
  get,
  put,
  getAll,
  has,
  keys
};
