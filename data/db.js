const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

const connectToDB = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  database = client.db('auth-blog');
};

const getDB = () => {
  if (!database) {
    throw { message: 'DB connection failed!' };
  }

  return database;
};

module.exports = {
  connectToDB,
  getDB,
};
