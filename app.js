const fs = require('fs');
const path = require('path');

const express = require('express');
const uuid = require('uuid');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

/* ROUTES */
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/restaurants', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'restaurants.json');
  const storedRestaurants = JSON.parse(fs.readFileSync(filePath));

  res.render('restaurants', {
    numberOfRestaurantsFound: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;

  const filePath = path.join(__dirname, 'data', 'restaurants.json');
  const restaurantsList = JSON.parse(fs.readFileSync(filePath));

  // const selectedRestaurant = restaurantsList.filter((restuarant => {
  //   return restuarant.id === restaurantId;
  // }))[0];
  for (const restaurant of restaurantsList) {
    if (restaurant.id === restaurantId) {
      return res.render('restaurant-detail', { restaurant });
    }
  }
});

app.get('/recommend', (req, res) => {
  res.render('recommend');
});

app.post('/recommend', (req, res) => {
  const restuarant = {
    id: uuid.v4(),
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
  res.render('about');
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

app.listen(3000, () => console.log('App started successfully...'));
