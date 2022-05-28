const router = require('express').Router();

const dbConn = require('../data/database');

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', (req, res) => {
  res.render('posts-list');
});

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

router.get('/new-post', async (req, res) => {
  const [authors] = await dbConn.query('SELECT * FROM authors');

  res.render('create-post', { authors });
});

module.exports = router;
