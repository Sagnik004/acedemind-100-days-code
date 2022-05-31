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
router.get('/posts', async (req, res) => {
  let posts;

  try {
    posts = await db
      .getDB()
      .collection('posts')
      .find({})
      .project({ title: 1, summary: 1, 'author.name': 1 })
      .toArray();
  } catch (err) {
    console.error(err);
    return res.status(500).render('500');
  }

  res.render('posts-list', { posts });
});

// Display create new post page
router.get('/new-post', async function (req, res) {
  try {
    const authors = await db.getDB().collection('authors').find().toArray();
    res.render('create-post', { authors });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
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
    return res.status(500).render('500');
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
    res.status(500).render('500');
  }
});

// View details of a post
router.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await db
      .getDB()
      .collection('posts')
      .findOne({ _id: new ObjectId(postId) }, { summary: 0 });

    if (!post) {
      return res.status(404).render('404');
    }

    post.humanReadableDate = post.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    post.date = post.date.toISOString();

    res.render('post-detail', { post });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

// Display edit post page
router.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await db
      .getDB()
      .collection('posts')
      .findOne(
        { _id: new ObjectId(postId) },
        { title: 1, summary: 1, body: 1 }
      );

    if (!post) {
      return res.status(404).render('404');
    }

    res.render('update-post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

// Handle update post request
router.post('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  const updatedPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
  };

  try {
    await db
      .getDB()
      .collection('posts')
      .updateOne({ _id: new ObjectId(postId) }, { $set: { ...updatedPost } });

    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

// Handle delete a post
router.post('/posts/:id/delete', async (req, res) => {
  const postId = new ObjectId(req.params.id);

  try {
    await db.getDB().collection('posts').deleteOne({ _id: postId });
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).render('500');
  }
});

module.exports = router;
