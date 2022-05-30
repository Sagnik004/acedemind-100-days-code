const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

const connect = async () => {
  const client = await MongoClient.connect('mongodb://localhost:27017/');
  database = client.db('blog');
};

const getDB = () => {
  if (!database) {
    throw new Error('Database connection not established!');
  }

  return database;
};

module.exports = {
  connectToDB: connect,
  getDB
};
