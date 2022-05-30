const express = require('express');

const db = require('../data/database');

const router = express.Router();

// Root route - redirect to home page
router.get('/', (req, res) => {
  res.redirect('/posts');
});

// Home page - display all posts
router.get('/posts', (req, res) => {
  res.render('posts-list');
});

// Display create new post page
router.get('/new-post', async function (req, res) {
  try {
    const authors = await db.getDB().collection('authors').find().toArray();
    res.render('create-post', { authors });
  } catch (err) {
    console.error(err);
    render('500');
  }
});

module.exports = router;
