const auth = async (req, res, next) => {
  const user = req.session.user;
  const isAuthenticated = req.session.isAuthenticated;

  if (!user || !isAuthenticated) {
    return next();
  }

  res.locals.isUserAuthenticated = isAuthenticated;
  next();
};

module.exports = auth;
