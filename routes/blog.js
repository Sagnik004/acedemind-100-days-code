const router = require('express').Router();

const dbConn = require('../data/database');

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', (req, res) => {
  res.render('posts-list');
});

router.get('/new-post', async (req, res) => {
  const [authors] = await dbConn.query('SELECT * FROM authors');
  
  res.render('create-post', { authors });
});

module.exports = router;
