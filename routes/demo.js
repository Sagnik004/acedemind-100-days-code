const express = require('express');

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

  const user = {
    email: inputEmail,
    password: inputPassword,
  };
  try {
    await db.getDb().collection('users').insertOne(user);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

router.post('/login', async (req, res) => {});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.post('/logout', (req, res) => {});

module.exports = router;
