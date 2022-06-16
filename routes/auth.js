const router = require('express').Router();
const bcrypt = require('bcryptjs');

const db = require('../data/db');

// Render Signup page request
router.get('/signup', (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      confirmEmail: '',
      password: '',
    };
  }

  req.session.inputData = null;
  res.render('signup', {
    inputData: sessionInputData,
  });
});

// Render Login page request
router.get('/login', (req, res) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: '',
      password: '',
    };
  }

  req.session.inputData = null;
  res.render('login', {
    inputData: sessionInputData,
  });
});

// Handle signup request submission
router.post('/signup', async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  // Validate input data
  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.trim().length < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    !enteredEmail.includes('@')
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input provided',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(function () {
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
    req.session.inputData = {
      hasError: true,
      message: 'User exists already!',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(function () {
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
});

// Handle login request submission
router.post('/login', async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  // Check if email is found
  const user = await db
    .getDB()
    .collection('users')
    .findOne({ email: enteredEmail });
  if (!user) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect('/login');
    });
    return;
  }

  // Check if passwords match
  const passwordMatches = await bcrypt.compare(enteredPassword, user.password);
  if (!passwordMatches) {
    req.session.inputData = {
      hasError: true,
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
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
});

// Handle logout request
router.post('/logout', (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect('/');
});

module.exports = router;
