const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

const connectToDatabase = async () => {
  const client = await MongoClient.connect(
    'mongodb://localhost:27017'
  );
  database = client.db('auth-demo');
};

const getDb = () => {
  if (!database) {
    throw { message: 'You must connect first!' };
  }

  return database;
};

module.exports = {
  connectToDatabase,
  getDb,
};
