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
};
