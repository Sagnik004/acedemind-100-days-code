const express = require('express');
const multer = require('multer');

const storageConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const router = express.Router();
const upload = multer({ storage: storageConfig });

router.get('/', (req, res) => {
  res.render('profiles');
});

router.get('/new-user', (req, res) => {
  res.render('new-user');
});

router.post('/profiles', upload.single('image'), (req, res) => {
  const uploadedImageFile = req.file;
  const userData = req.body;

  console.log(uploadedImageFile);
  console.log(userData);

  res.redirect('/');
});

module.exports = router;
