const getSessionErrorData = (req, postTitle, postContent) => {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: postTitle ? postTitle : '',
      content: postContent ? postContent : '',
    };
  }

  req.session.inputData = null;
  return sessionInputData;
};

const getSessionErrorAuthData = (req, sessionAuthFields) => {
  let sessionInputData = req.session.inputData;
  const email = sessionAuthFields.email ? sessionAuthFields.email : null;
  const confirmEmail = sessionAuthFields.confirmEmail
    ? sessionAuthFields.confirmEmail
    : null;
  const password = sessionAuthFields.password
    ? sessionAuthFields.password
    : null;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email,
      confirmEmail,
      password,
    };
  }

  req.session.inputData = null;
  return sessionInputData;
};

const flashErrorsToSession = (req, data, action) => {
  req.session.inputData = {
    hasError: true,
    ...data,
  };

  req.session.save(action);
};

module.exports = {
  getSessionErrorData,
  flashErrorsToSession,
  getSessionErrorAuthData,
};
