const path = require('path');

const express = require('express');
const session = require('express-session');
const csrf = require('csurf');

const db = require('./data/db');
const sessionConfig = require('./config/session');
const authMiddleware = require('./middlewares/auth-middleware');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');

const mongoDbSessionStore = sessionConfig.createSessionStore(session);
const app = express();

// Render views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Expose public folder, and parse URL encoding requests
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));

// Setup CSRF
app.use(csrf());

// Middleware to make isAuthenticated available to route handlers and templates
app.use(authMiddleware);

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
