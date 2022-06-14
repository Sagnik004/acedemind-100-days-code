const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/db');

const ObjectId = mongodb.ObjectId;

// Root page
router.get('/', (req, res) => {
  res.render('welcome', { csrfToken: req.csrfToken() });
});

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
    csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
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

// Render admin page request
router.get('/admin', async (req, res) => {
  if (!res.locals.isUserAuthenticated) {
    return res.status(401).render('401');
  }

  const posts = await db.getDB().collection('posts').find().toArray();
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

// Handle logout request
router.post('/logout', (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect('/');
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

  const newPost = {
    title: enteredTitle,
    content: enteredContent,
  };
  await db.getDB().collection('posts').insertOne(newPost);

  res.redirect('/admin');
});

// Render Edit Post page
router.get('/posts/:id/edit', async (req, res) => {
  const postId = new ObjectId(req.params.id);
  const post = await db.getDB().collection('posts').findOne({ _id: postId });

  if (!post) {
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
  const postId = new ObjectId(req.params.id);

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

  await db
    .getDB()
    .collection('posts')
    .updateOne(
      { _id: postId },
      { $set: { title: enteredTitle, content: enteredContent } }
    );

  res.redirect('/admin');
});

// Handle delete post request submission
router.post('/posts/:id/delete', async (req, res) => {
  const postId = new ObjectId(req.params.id);
  await db.getDB().collection('posts').deleteOne({ _id: postId });

  res.redirect('/admin');
});

module.exports = router;
