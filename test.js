const MongoClient = require('mongodb').MongoClient;
const test = require('micro-analytics-cli/adapter-tests/unit-tests');
const path = require('path');

const URL = `mongodb://localhost:27017/anlyticsdb`;

async function runTest() {

  var Clinent = MongoClient .connect(URL)
    .then(function(connection) {
      const db = connection;

      test({
        name: 'mongodb',
        modulePath: path.resolve(__dirname, './index.js'),
        afterAll: async (adapter) => {
          await db.close()
        }
      })

    })
    .catch(function(err) {
      console.log(err);
    });

}

runTest();
