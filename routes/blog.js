const router = require('express').Router();

const Post = require('../models/post');

// Root page
router.get('/', (req, res) => {
  res.render('welcome', { csrfToken: req.csrfToken() });
});

// Render admin page request
router.get('/admin', async (req, res) => {
  if (!res.locals.isUserAuthenticated) {
    return res.status(401).render('401');
  }

  const posts = await Post.fetchAll();
  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: '',
      content: '',
    };
  }
  req.session.inputData = null;

  res.render('admin', {
    posts,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

// Handle new posts submission
router.post('/posts', async (req, res) => {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim().length === 0 ||
    enteredContent.trim().length === 0
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };
    return res.redirect('/admin');
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect('/admin');
});

// Render Edit Post page
router.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;
  const post = new Post(null, null, postId);
  await post.fetch();

  if (!post.title || !post.content) {
    return res.render('404');
  }

  let sessionInputData = req.session.inputData;
  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: post.title,
      content: post.content,
    };
  }
  req.session.inputData = null;

  res.render('single-post', {
    post,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

// Handle edit post request submission
router.post('/posts/:id/edit', async (req, res) => {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  const postId = req.params.id;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === '' ||
    enteredContent.trim() === ''
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };
    return res.redirect(`/posts/${req.params.id}/edit`);
  }

  const post = new Post(enteredTitle, enteredContent, postId);
  await post.update();

  res.redirect('/admin');
});

// Handle delete post request submission
router.post('/posts/:id/delete', async (req, res) => {
  const postId = req.params.id;

  const post = new Post(undefined, undefined, postId);
  await post.delete();

  res.redirect('/admin');
});

module.exports = router;
