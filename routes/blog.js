const router = require('express').Router();

const blogController = require('../controllers/post-controller');

router.get('/', blogController.getHome);
router.get('/admin', blogController.getAdmin);

router.post('/posts', blogController.createPost);
router.get('/posts/:id/edit', blogController.getSinglePost);
router.post('/posts/:id/edit', blogController.updatePost);
router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
