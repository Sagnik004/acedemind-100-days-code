const path = require('path');

const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');
const csrf = require('csurf');

const db = require('./data/db');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');

const MongoDBStore = mongodbStore(session);
const app = express();

const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'auth-blog',
  collection: 'sessions'
});

// Render views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Expose public folder, and parse URL encoding requests
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(session({
  secret: 'super-secret-mvc-refactoring',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Setup CSRF
app.use(csrf());

// Middleware to make isAuthenticated available to route handlers and templates
app.use(async (req, res, next) => {
  const user = req.session.user;
  const isAuthenticated = req.session.isAuthenticated;

  if (!user || !isAuthenticated) {
    return next();
  }

  res.locals.isUserAuthenticated = isAuthenticated;
  next();
});

// Routes...
app.use(blogRoutes);
app.use(authRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.render('500');
});

// Connect to DB and start app
db.connectToDB()
  .then(() => {
    app.listen(3000, () => console.log('App started successfully...'));
  })
  .catch((err) => {
    console.error(err);
    console.log('Could not connect to database');
  });
