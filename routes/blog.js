const express = require('express');
const mongodb = require('mongodb');

const db = require('../data/database');

const ObjectId = mongodb.ObjectId;
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

// Handle new post form submit request
router.post('/posts', async (req, res) => {
  const authorId = new ObjectId(req.body.author);
  let author;

  try {
    author = await db.getDB().collection('authors').findOne({
      _id: authorId,
    });
  } catch (err) {
    console.error(err);
    return res.render('500');
  }

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId,
      name: author.name,
      email: author.email,
    },
  };

  try {
    await db.getDB().collection('posts').insertOne(newPost);
    res.redirect('/posts');
  } catch (err) {
    res.render('500');
  }
});

module.exports = router;
