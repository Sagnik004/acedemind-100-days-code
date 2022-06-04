const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  database = client.db('file-demo');
};

const getDb = () => {
  if (!database) {
    throw { message: 'Database not connected!' };
  }

  return database;
};

module.exports = {
  connectToDatabase,
  getDb,
};
