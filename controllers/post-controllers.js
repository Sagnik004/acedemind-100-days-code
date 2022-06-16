const Post = require('../models/post');
const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

const getHome = (req, res) => {
  res.render('welcome', { csrfToken: req.csrfToken() });
};

const getAdmin = async (req, res) => {
  if (!res.locals.isUserAuthenticated) {
    return res.status(401).render('401');
  }

  const posts = await Post.fetchAll();
  const sessionErrorData = validationSession.getSessionErrorData(req);

  res.render('admin', {
    posts,
    inputData: sessionErrorData,
    csrfToken: req.csrfToken(),
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

const getSinglePost = async (req, res) => {
  const postId = req.params.id;
  const post = new Post(null, null, postId);
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
    csrfToken: req.csrfToken(),
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
