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

const sortRestaurantsAsc = (restaurantsList) => {
  restaurantsList.sort((resA, resB) => {
    if (resA.name > resB.name) {
      return 1;
    }
    return -1;
  });
  return restaurantsList;
};

const sortRestaurantsDesc = (restaurantsList) => {
  restaurantsList.sort((resA, resB) => {
    if (resB.name > resA.name) {
      return 1;
    }
    return -1;
  });
  return restaurantsList;
};

module.exports = {
  getStoredRestaurants,
  saveNewRestaurant,
  sortRestaurantsAsc,
  sortRestaurantsDesc,
};
