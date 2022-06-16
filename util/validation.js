const postIsValid = (title, content) => {
  if (!title || !content || title.trim() === '' || content.trim() === '') {
    return false;
  }

  return true;
};

module.exports = {
  postIsValid,
};
