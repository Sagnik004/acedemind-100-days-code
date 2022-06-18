const router = require('express').Router();

const authControllers = require('../controllers/auth-controller');

/* Routes... */
router.get('/signup', authControllers.renderSignup);
router.get('/login', authControllers.renderLogin);
router.post('/signup', authControllers.handleSignupReq);
router.post('/login', authControllers.handleLoginReq);
router.post('/logout', authControllers.handleLogoutReq);

module.exports = router;
