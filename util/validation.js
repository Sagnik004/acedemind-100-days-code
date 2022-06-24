const userCredentialsAreValid = (email, password) => {
  return (
    email && email.includes('@') && password && password.trim().length >= 6
  );
};

const isEmpty = (value) => {
  return !value || value.trim() === '';
};

const userDetailsAreValid = (userDetails) => {
  const { email, password, name, street, postal, city } = userDetails;

  if (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  ) {
    return true;
  }

  return false;
};

const emailIsConfirmed = (email, confirmEmail) => {
  return email === confirmEmail;
};

module.exports = {
  userDetailsAreValid,
  emailIsConfirmed,
};
