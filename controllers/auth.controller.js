const User = require('../models/user.model');
const authUtil = require('../util/authentication');

const getSignup = (req, res) => {
  res.render('customer/auth/signup');
};

const signup = async (req, res) => {
  const {
    email,
    'confirm-email': confirmEmail,
    password,
    fullname: name,
    street,
    postal,
    city,
  } = req.body;

  const user = new User(email, password, name, street, postal, city);
  await user.signup();

  res.redirect('/login');
};

const getLogin = (req, res) => {
  res.render('customer/auth/login');
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email exists
  const user = new User(email, password);
  const existingUser = await user.getUserWithSameEmail();
  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  // Check if password matches
  const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  if (!passwordIsCorrect) {
    res.redirect('/login');
    return;
  }

  // Create user's session and redirect to home page
  authUtil.createUserSession(req, existingUser, function() {
    res.redirect('/');
  });
};

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
};
