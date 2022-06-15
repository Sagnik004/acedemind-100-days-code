const Post = require('../models/post');

const getHome = (req, res) => {
  res.render('welcome', { csrfToken: req.csrfToken() });
};

const getAdmin = async (req, res) => {
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
};

const createPost = async (req, res) => {
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
};

const getSinglePost = async (req, res) => {
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
};

const updatePost = async (req, res) => {
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
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  const post = new Post(undefined, undefined, postId);
  await post.delete();

  res.redirect('/admin');
};

module.exports = {
  getHome,
  getAdmin,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
};
