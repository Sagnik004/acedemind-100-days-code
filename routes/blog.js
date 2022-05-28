const router = require('express').Router();

const dbConn = require('../data/database');

// Root route - redirect to home page
router.get('/', (req, res) => {
  res.redirect('/posts');
});

// Home page - Display all available posts
router.get('/posts', async (req, res) => {
  const query = `
  SELECT posts.*, authors.name as author_name, authors.email as author_email
  FROM posts INNER JOIN authors 
  ON posts.author_id = authors.id`;

  const [posts] = await dbConn.query(query);

  res.render('posts-list', { posts });
});

// Display details of a selected post
router.get('/posts/:id', async (req, res) => {
  const postId = +req.params.id;

  const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email 
    FROM posts INNER JOIN authors ON posts.author_id = authors.id 
    WHERE posts.id = ?
  `;

  const [posts] = await dbConn.query(query, [postId]);
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  res.render('post-detail', { post: postData });
});

// Display edit a post page
router.get('/posts/:id/edit', async (req, res) => {
  const postId = +req.params.id;

  const query = `
    SELECT * FROM posts WHERE id = ?
  `;
  const [posts] = await dbConn.query(query, [postId]);
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }
  const post = posts[0];

  res.render('update-post', { post });
});

// Update post data - form submission
router.post('/posts/:id/edit', async (req, res) => {
  const postId = +req.params.id;
  const {
    title: postTitle,
    summary: postSummary,
    content: postBody,
  } = req.body;

  const query = `
    UPDATE posts SET title = ?, summary = ?, body = ?
    WHERE id = ?
  `;
  await dbConn.query(query, [postTitle, postSummary, postBody, postId]);

  res.redirect('/posts');
});

// Display create new post page
router.post('/posts', async (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];

  await dbConn.query(
    'INSERT INTO posts (title, summary, body, author_id) VALUES (?)',
    [data]
  );

  res.redirect('/posts');
});

// Handle new post create request
router.get('/new-post', async (req, res) => {
  const [authors] = await dbConn.query('SELECT * FROM authors');

  res.render('create-post', { authors });
});

// Handle delete post request
router.post('/posts/:id/delete', async (req, res) => {
  const postId = +req.params.id;

  const query = `
    DELETE FROM posts WHERE id = ?
  `;
  await dbConn.query(query, [postId]);

  res.redirect('/posts');
});

module.exports = router;
