const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

const createSessionStore = () => {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'online-shop',
    collection: 'sessions',
  });

  return store;
};

const createSessionConfig = () => {
  return {
    secret: 'my-online-store-heavy-weight-secret-$',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  };
};

module.exports = createSessionConfig;
