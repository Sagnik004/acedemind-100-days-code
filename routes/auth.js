const router = require('express').Router();

const authController = require('../controllers/auth-controller');

/* Routes... */
router.get('/signup', authController.renderSignup);
router.get('/login', authController.renderLogin);

router.post('/signup', authController.handleSignupReq);
router.post('/login', authController.handleLoginReq);
router.post('/logout', authController.handleLogoutReq);

router.get('/401', authController.renderUnauthorized);

module.exports = router;
