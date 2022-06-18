const Post = require('../models/post');
const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

const getHome = (req, res) => {
  res.render('welcome');
};

const getAdmin = async (req, res) => {
  const posts = await Post.fetchAll();
  const sessionErrorData = validationSession.getSessionErrorData(req);

  res.render('admin', {
    posts,
    inputData: sessionErrorData,
  });
};

const createPost = async (req, res) => {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    const dataToFlash = {
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };
    validationSession.flashErrorsToSession(req, dataToFlash, function () {
      res.redirect('/admin');
    });
    return;
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect('/admin');
};

const getSinglePost = async (req, res, next) => {
  const postId = req.params.id;

  let post;
  try {
    post = new Post(null, null, postId);
  } catch (err) {
    return next(err);
  }

  await post.fetch();

  if (!post.title || !post.content) {
    return res.render('404');
  }

  const sessionErrorData = validationSession.getSessionErrorData(
    req,
    post.title,
    post.content
  );

  res.render('single-post', {
    post,
    inputData: sessionErrorData,
  });
};

const updatePost = async (req, res) => {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  const postId = req.params.id;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    const dataToFlash = {
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };
    validationSession.flashErrorsToSession(req, dataToFlash, function () {
      res.redirect(`/posts/${req.params.id}/edit`);
    });
    return;
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
