const mongodbStore = require('connect-mongodb-session');

const createSessionStore = (session) => {
  const MongoDBStore = mongodbStore(session);
  const sessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'auth-blog',
    collection: 'sessions',
  });

  return sessionStore;
};

const createSessionConfig = (sessionStore) => {
  return {
    secret: 'super-secret-mvc-refactoring',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  };
};

module.exports = {
  createSessionStore,
  createSessionConfig,
};
