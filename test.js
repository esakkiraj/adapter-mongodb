const MClient = require('mongodb').MongoClient;
const test = require('micro-analytics-cli/adapter-tests/unit-tests');
const path = require('path');

const collectionName = process.env.MAA_MONGODB_COLLECTION_NAME || 'ma-events';
const URL = process.env.MAA_MONGODB_URL || `mongodb://127.0.0.1:27017/ma-analyticsdb-test`;

let DB;


async function getMACollection() {
  if(!DB) {
    DB = await MClient.connect(URL); 
  }
  return await DB.collection(collectionName);
}

function runTest() {

  test({
    name: 'mongodb',
    modulePath: path.resolve(__dirname, './index.js'),
    beforeEach: async (adapter) => {
      const collection = await getMACollection();
      return await collection.deleteMany({});
    },
    afterAll: async (adapter) => {
      const collection = await getMACollection();
      await collection.deleteMany({});
      await collection.drop();

      return adapter.close();
    }
  });

}

runTest();
