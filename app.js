const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

/* ROUTES */
app.get('/', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'index.html');
  res.sendFile(htmlFilePath);
});

app.get('/restaurants', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'restaurants.html');
  res.sendFile(htmlFilePath);
});

app.get('/recommend', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'recommend.html');
  res.sendFile(htmlFilePath);
});

app.post('/recommend', (req, res) => {
  const restuarant = {
    name: req.body.name,
    address: req.body.address,
    cuisine: req.body.cuisine,
    website: req.body.website,
    description: req.body.description,
  };

  const filePath = path.join(__dirname, 'data', 'restaurants.json');
  const fileData = JSON.parse(fs.readFileSync(filePath));

  fileData.push(restuarant);

  fs.writeFileSync(filePath, JSON.stringify(fileData));

  res.redirect('/confirm');
});

app.get('/about', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'about.html');
  res.sendFile(htmlFilePath);
});

app.get('/confirm', (req, res) => {
  const htmlFilePath = path.join(__dirname, 'views', 'confirm.html');
  res.sendFile(htmlFilePath);
});

app.listen(3000, () => console.log('App started successfully...'));
