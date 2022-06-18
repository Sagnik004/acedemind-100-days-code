const User = require('../models/user');
const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

const renderSignup = (req, res) => {
  const sessionErrorData = validationSession.getSessionErrorAuthData(req, {
    email: '',
    confirmEmail: '',
    password: '',
  });
  res.render('signup', {
    inputData: sessionErrorData,
  });
};

const renderLogin = (req, res) => {
  const sessionErrorData = validationSession.getSessionErrorAuthData(req, {
    email: '',
    password: '',
  });
  res.render('login', {
    inputData: sessionErrorData,
  });
};

const handleSignupReq = async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  // Validate input data
  if (
    !validation.signupFieldsAreValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    const errorData = {
      message: 'Invalid input provided',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/signup');
    });
    return;
  }

  // Instantiate new user
  const newUser = new User(enteredEmail, enteredPassword);

  // Validate if email already exists
  const userExistsAlready = await newUser.existsAlready();
  if (userExistsAlready) {
    const errorData = {
      message: 'User exists already!',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function () {
      res.redirect('/signup');
    });
    return;
  }

  // Save user in DB with hashed password, and redirect to login page
  await newUser.signup();

  res.redirect('/login');
};

const handleLoginReq = async (req, res) => {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  // Instantiate user
  const newUser = new User(enteredEmail, enteredPassword);

  // Validate user is found
  const existingUser = await newUser.getUserWithSameEmail();
  if (!existingUser) {
    const errorData = {
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/login');
    });
    return;
  }

  // Try logging in
  const loginSuccessful = await newUser.login(existingUser.password);
  if (!loginSuccessful) {
    const errorData = {
      message: 'Could not log you in - please check your credentials!',
      email: enteredEmail,
      password: enteredPassword,
    };
    validationSession.flashErrorsToSession(req, errorData, function() {
      res.redirect('/login');
    });
    return;
  }

  // Setup session data and redirect to admin page
  req.session.user = {
    id: existingUser._id,
    email: existingUser.email,
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    return res.redirect('/admin');
  });
};

const handleLogoutReq = (req, res) => {
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect('/');
};

module.exports = {
  renderSignup,
  renderLogin,
  handleSignupReq,
  handleLoginReq,
  handleLogoutReq,
};
