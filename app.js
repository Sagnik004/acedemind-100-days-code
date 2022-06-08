const path = require('path');

const express = require('express');

const db = require('./data/database');
const demoRoutes = require('./routes/demo');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

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
