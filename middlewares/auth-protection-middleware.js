const guardRoute = (req, res, next) => {
  if (!res.locals.isUserAuthenticated) {
    return res.redirect('/401');
  }

  next();
};

module.exports = guardRoute;
