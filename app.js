const path = require('path');

const express = require('express');

const db = require('./data/database');
const authRoutes = require('./routes/auth.routes');

// Create Express app
const app = express();

// Make Express aware we will use EJS view template & engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make public folder accessible to get assets
app.use(express.static('public'));

// Parse request body sent via forms
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(authRoutes);

// Connect to database and start-up server
db.connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log(`App started successfully at port 3000...`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database!');
    console.log(error);
  });
