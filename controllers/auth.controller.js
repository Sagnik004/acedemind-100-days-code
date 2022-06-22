const User = require('../models/user.model');
const authUtil = require('../util/authentication');

const getSignup = (req, res) => {
  res.render('customer/auth/signup');
};

const signup = async (req, res, next) => {
  const {
    email,
    'confirm-email': confirmEmail,
    password,
    fullname: name,
    street,
    postal,
    city,
  } = req.body;

  try {
    const user = new User(email, password, name, street, postal, city);
    await user.signup();  
  } catch (error) {
    return next(error);
  }

  res.redirect('/login');
};

const getLogin = (req, res) => {
  res.render('customer/auth/login');
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email exists
  let user, existingUser;
  try {
    user = new User(email, password);
    existingUser = await user.getUserWithSameEmail();  
  } catch (error) {
    return next(error);
  }
  
  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  // Check if password matches
  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!passwordIsCorrect) {
    res.redirect('/login');
    return;
  }

  // Create user's session and redirect to home page
  authUtil.createUserSession(req, existingUser, function() {
    res.redirect('/');
  });
};

const logout = (req, res) => {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
};

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
};
