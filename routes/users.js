const express = require('express');
const multer = require('multer');

const db = require('../data/database');

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const router = express.Router();
const upload = multer({ storage: storageConfig });

router.get('/', (req, res) => {
  res.render('profiles');
});

router.get('/new-user', (req, res) => {
  res.render('new-user');
});

router.post('/profiles', upload.single('image'), async (req, res) => {
  const uploadedImageFile = req.file;
  const userData = req.body;

  try {
    await db.getDb().collection('users').insertOne({
      name: userData.username,
      imagePath: uploadedImageFile.path,
    });

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Something went wrong!');
  }
});

module.exports = router;
