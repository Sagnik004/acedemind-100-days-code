const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({  });

router.get('/', (req, res) => {
  res.render('profiles');
});

router.get('/new-user', (req, res) => {
  res.render('new-user');
});

router.post('/profiles', upload.single('image'), (req, res) => {
  const uploadedImageFile = req.file;
  const userData = req.body;
  console.log('uploadedImageFile: ', uploadedImageFile);
  console.log('userData: ', userData);
  res.send('success');
});

module.exports = router;
