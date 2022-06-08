const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('welcome');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
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
    return res.redirect('/signup');
  }

  // Email exists already?
  const emailFound = await db.getDb().collection('users').findOne({
    email: inputEmail
  });
  if (emailFound) {
    return res.redirect('/signup');
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
      return res.redirect('/login');
    }

    const isPasswordMatching = await bcrypt.compare(
      inputPassword,
      user.password
    );
    if (!isPasswordMatching) {
      console.info('Could not login - password issue!');
      return res.redirect('/login');
    }

    res.redirect('/admin');
  } catch (error) {
    res.status(500).render('500');
  }
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.post('/logout', (req, res) => {});

module.exports = router;
