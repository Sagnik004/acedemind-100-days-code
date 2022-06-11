const path = require('path');

const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');

const db = require('./data/database');
const demoRoutes = require('./routes/demo');

const MongodbStore = mongodbStore(session);

const app = express();

const sessionStore = new MongodbStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'auth-demo',
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'user-auth-super-secret',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

app.use(async (req, res, next) => {
  const isAuthenticated = req.session.isUserAuthenticated;
  const savedUser = req.session.user;
  if (!savedUser || !isAuthenticated) {
    return next();
  }

  const user = await db.getDb().collection('users').findOne({
    _id: savedUser.id
  });
  const isAdmin = user.isAdmin;
  res.locals.isAuthenticated = isAuthenticated;
  res.locals.isAdmin = isAdmin;

  next();
});

app.use(demoRoutes);

app.use((error, req, res, next) => {
  res.render('500');
});

db.connectToDatabase()
  .then(() => {
    app.listen(3000, () => console.log('App started successfully...'));
  })
  .catch((error) => {
    console.error('Could not connect to DB!');
    console.error(error);
  });
