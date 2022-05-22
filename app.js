const path = require('path');

const express = require('express');
const uuid = require('uuid');

const { getStoredRestaurants, saveNewRestaurant } = require('./util/restaurant-data.js');

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
  const storedRestaurants = getStoredRestaurants();

  res.render('restaurants', {
    numberOfRestaurantsFound: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get('/restaurants/:id', (req, res) => {
  const restaurantId = req.params.id;

  const restaurantsList = getStoredRestaurants();

  // const selectedRestaurant = restaurantsList.filter((restuarant => {
  //   return restuarant.id === restaurantId;
  // }))[0];
  for (const restaurant of restaurantsList) {
    if (restaurant.id === restaurantId) {
      return res.render('restaurant-detail', { restaurant });
    }
  }

  return res.render('404');
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

  const savedRestaurants = getStoredRestaurants();
  savedRestaurants.push(restuarant);
  saveNewRestaurant(savedRestaurants);

  res.redirect('/confirm');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/confirm', (req, res) => {
  res.render('confirm');
});

// 404 - Page not found handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Internal Server Error handler
app.use((error, req, res, next) => {
  res.status(500).render('500');
});

app.listen(3000, () => console.log('App started successfully...'));
