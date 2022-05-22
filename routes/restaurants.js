const router = require('express').Router();
const uuid = require('uuid');

const {
  getStoredRestaurants,
  saveNewRestaurant,
  sortRestaurantsAsc,
  sortRestaurantsDesc,
} = require('../util/restaurant-data');

router.get('/restaurants', (req, res) => {
  let sortOrder = req.query.order;
  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    sortOrder = 'asc';
  }

  const storedRestaurants = getStoredRestaurants();
  let sortedRestaurantsList = [];
  switch (sortOrder) {
    case 'asc':
      sortedRestaurantsList = sortRestaurantsAsc(storedRestaurants);
      break;
    case 'desc':
      sortedRestaurantsList = sortRestaurantsDesc(storedRestaurants);
  }

  res.render('restaurants', {
    numberOfRestaurantsFound: sortedRestaurantsList.length,
    restaurants: sortedRestaurantsList,
    nextSortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
  });
});

router.get('/restaurants/:id', (req, res) => {
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

router.get('/recommend', (req, res) => {
  res.render('recommend');
});

router.post('/recommend', (req, res) => {
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

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

module.exports = router;
