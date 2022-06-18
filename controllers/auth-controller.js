const bcrypt = require('bcryptjs');

const db = require('../data/db');
const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

const renderSignup = (req, res) => {
  const sessionErrorData = validationSession.getSessionErrorAuthData(req, {
    email: '',
    confirmEmail: '',
    password: '',
  });
  res.render('signup', {
    inputData: sessionErrorData,
  });
};

const renderLogin = (req, res) => {
  const sessionErrorData = validationSession.getSessionErrorAuthData(req, {
    email: '',
    password: '',
  });
  res.render('login', {
    inputData: sessionErrorData,
  });
};

const handleSignupReq = async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  // Validate input data
  if (
    !validation.signupFieldsAreValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    const errorData = {
      message: 'Invalid input provided',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/signup');
    });
    return;
  }

  // Validate if email already exists
  const userExists = await db
    .getDB()
    .collection('users')
    .findOne({ email: enteredEmail });
  if (userExists) {
    const errorData = {
      message: 'User exists already!',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function () {
      res.redirect('/signup');
    });
    return;
  }

  // Save user in DB with hashed password, and redirect to login page
  const hashedPassword = await bcrypt.hash(enteredPassword, 12);
  const user = {
    email: enteredEmail,
    password: hashedPassword,
  };
  await db.getDB().collection('users').insertOne(user);

  res.redirect('/login');
};

const handleLoginReq = async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  // Check if email is found
  const user = await db
    .getDB()
    .collection('users')
    .findOne({ email: enteredEmail });
  if (!user) {
    const errorData = {
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/login');
    });
    return;
  }

  // Check if passwords match
  const passwordMatches = await bcrypt.compare(enteredPassword, user.password);
  if (!passwordMatches) {
    const errorData = {
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/login');
    });
    return;
  }

  req.session.user = {
    id: user._id,
    email: user.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    return res.redirect('/admin');
  });
};

const handleLogoutReq = (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect('/');
};

module.exports = {
  renderSignup,
  renderLogin,
  handleSignupReq,
  handleLoginReq,
  handleLogoutReq,
};
