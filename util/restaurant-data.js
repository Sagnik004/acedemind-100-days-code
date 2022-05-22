const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data', 'restaurants.json');

const getStoredRestaurants = () => {
  const restaurantsList = JSON.parse(fs.readFileSync(filePath));
  return restaurantsList;
};

const saveNewRestaurant = (newRestaurantData) => {
  fs.writeFileSync(filePath, JSON.stringify(newRestaurantData));
};

module.exports = {
  getStoredRestaurants,
  saveNewRestaurant,
};
