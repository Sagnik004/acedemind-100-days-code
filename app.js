const path = require('path');

const express = require('express');

const userRoutes = require('./routes/users');
const db = require('./data/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(userRoutes);

db.connectToDatabase()
  .then(() => {
    app.listen(3000, () => console.log('App started successfully...'));
  })
  .catch((err) => {
    console.error('DB connection failed!');
    console.error(err);
  });
