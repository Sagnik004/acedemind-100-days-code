const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

const getSignup = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      name: '',
      street: '',
      postal: '',
      city: '',
    };
  }

  res.render('customer/auth/signup', { inputData: sessionData });
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

  const userInputDetails = {
    email,
    password,
    name,
    street,
    postal,
    city,
  };

  if (
    !validation.userDetailsAreValid(userInputDetails) ||
    !validation.emailIsConfirmed(email, confirmEmail)
  ) {
    const dataToFlash = {
      ...userInputDetails,
      confirmEmail,
      errorMessage: 'Invalid input. Please verify and re-submit.',
    };
    sessionFlash.flashDataToSession(req, dataToFlash, function () {
      res.redirect('/signup');
    });
    return;
  }

  const user = new User(email, password, name, street, postal, city);
  try {
    const userExistsAlready = await user.existsAlready();
    if (userExistsAlready) {
      const dataToFlash = {
        ...userInputDetails,
        confirmEmail,
        errorMessage: 'User exists already! Try logging in instead.',
      };
      sessionFlash.flashDataToSession(req, dataToFlash, function () {
        res.redirect('/signup');
      });
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect('/login');
};

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }

  res.render('customer/auth/login', { inputData: sessionData });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const sessionErrorData = {
    email,
    password,
    errorMessage: 'Invalid credentials provided!',
  };

  // Check if email exists
  let user, existingUser;
  try {
    user = new User(email, password);
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
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
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  // Create user's session and redirect to home page
  authUtil.createUserSession(req, existingUser, function () {
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
