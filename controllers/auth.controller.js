const getSignup = (req, res) => {
  res.render('customer/auth/signup');
};

const getLogin = (req, res) => {};

module.exports = {
  getSignup,
  getLogin,
};
