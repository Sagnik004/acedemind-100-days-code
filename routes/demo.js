const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('welcome');
});

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
  res.render('signup', { inputData: sessionInputData });
});

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
  res.render('login', { inputData: sessionInputData });
});

// Sign-up form submission
router.post('/signup', async (req, res) => {
  const userData = req.body;
  const inputEmail = userData.email;
  const inputConfirmEmail = userData['confirm-email'];
  const inputPassword = userData.password;

  // Input validations
  if (
    !inputEmail ||
    !inputConfirmEmail ||
    !inputPassword ||
    inputPassword.trim().length < 6 ||
    inputEmail !== inputConfirmEmail ||
    !inputEmail.includes('@')
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input, please check your data!',
      email: inputEmail,
      confirmEmail: inputConfirmEmail,
      password: inputPassword,
    };
    req.session.save(function() {
      res.redirect('/signup');
    });
    return;
  }

  // Email exists already?
  const emailFound = await db.getDb().collection('users').findOne({
    email: inputEmail
  });
  if (emailFound) {
    req.session.inputData = {
      hasError: true,
      message: 'User exists already!',
      email: inputEmail,
      confirmEmail: inputConfirmEmail,
      password: inputPassword,
    };
    req.session.save(function() {
      res.redirect('/signup');
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(inputPassword, 12);
  const user = {
    email: inputEmail,
    password: hashedPassword,
  };

  try {
    await db.getDb().collection('users').insertOne(user);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

// Handle login request
router.post('/login', async (req, res) => {
  const userData = req.body;
  const { email: inputEmail, password: inputPassword } = userData;

  try {
    const user = await db.getDb().collection('users').findOne({
      email: inputEmail,
    });

    if (!user) {
      console.info('Could not login - email issue!');
      req.session.inputData = {
        hasError: true,
        message: 'Invalid credentials!',
        email: inputEmail,
        password: inputPassword,
      };
      req.session.save(function() {
        res.redirect('/login');
      });
      return;
    }

    const isPasswordMatching = await bcrypt.compare(
      inputPassword,
      user.password
    );
    if (!isPasswordMatching) {
      console.info('Could not login - password issue!');
      req.session.inputData = {
        hasError: true,
        message: 'Invalid credentials!',
        email: inputEmail,
        password: inputPassword,
      };
      req.session.save(function() {
        res.redirect('/login');
      });
      return;
    }

    req.session.user = {
      id: user._id,
      email: user.email,
    };
    req.session.isUserAuthenticated = true;
    req.session.save(function() {
      res.redirect('/profile');
    });
  } catch (error) {
    res.status(500).render('500');
  }
});

router.get('/admin', async (req, res) => {
  if (!res.locals.isAuthenticated) {
    return res.status(401).render('401');
  }

  if (!res.locals.isAdmin) {
    return res.status(403).render('403');
  }

  res.render('admin');
});

router.get('/profile', (req, res) => {
  if (!res.locals.isAuthenticated) {
    return res.status(401).render('401');
  }

  res.render('profile');
});

router.post('/logout', (req, res) => {
  req.session.user = null;
  req.session.isUserAuthenticated = false;

  res.redirect('/');
});

module.exports = router;
