const router = require('express').Router();

const guardRoute = require('../middlewares/auth-protection-middleware');
const blogController = require('../controllers/post-controller');

router.get('/', blogController.getHome);

// Guard all other below routes
router.use(guardRoute);

router.get('/admin', blogController.getAdmin);
router.post('/posts', blogController.createPost);
router.get('/posts/:id/edit', blogController.getSinglePost);
router.post('/posts/:id/edit', blogController.updatePost);
router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
