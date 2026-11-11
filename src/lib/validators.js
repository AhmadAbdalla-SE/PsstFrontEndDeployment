export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value ?? "");

export const PASSWORD_SPECIALS = "!@#_$%^&*()";
export const isPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#_$%^&*()]).{8,16}$/.test(value ?? "");

export const isPhone = (value) => /^\+[1-9]\d{1,14}$/.test(value ?? "");

export const isOtp = (value) => /^\d{6}$/.test(value ?? "");

export const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value ?? "");

export const isFullName = (value) => {
  const name = (value ?? "").trim();
  return name.length >= 2 && name.includes(" ");
};

export const validateSignup = (values) => {
  const errors = {};

  if (!values.username?.trim()) {
    errors.username = "Tell us your name";
  } else if (!isFullName(values.username)) {
    errors.username = "First and last name, with a space between them";
  }

  if (!values.email?.trim()) {
    errors.email = "An email is required";
  } else if (!isEmail(values.email)) {
    errors.email = "That does not look like an email address";
  }

  if (!values.phone?.trim()) {
    errors.phone = "A phone number is required";
  } else if (!isPhone(values.phone)) {
    errors.phone = "Use the international form, like +201234567890";
  }

  if (!values.password) {
    errors.password = "Pick a password";
  } else if (!isPassword(values.password)) {
    errors.password = `8 to 16 characters, with a capital, a small letter and one of ${PASSWORD_SPECIALS}`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Type the password again";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "The two passwords do not match";
  }

  if (values.gender !== 0 && values.gender !== 1) {
    errors.gender = "Choose one";
  }

  return errors;
};

export const validateLogin = (values) => {
  const errors = {};
  if (!values.email?.trim()) {
    errors.email = "An email is required";
  } else if (!isEmail(values.email)) {
    errors.email = "That does not look like an email address";
  }
  if (!values.password) {
    errors.password = "A password is required";
  }
  return errors;
};

export const validateOtp = (values) => {
  const errors = {};
  if (!values.otp) {
    errors.otp = "Enter the 6 digit code";
  } else if (!isOtp(values.otp)) {
    errors.otp = "The code is 6 digits";
  }
  return errors;
};

export const validateNewPassword = (values) => {
  const errors = {};
  if (!values.password) {
    errors.password = "Pick a password";
  } else if (!isPassword(values.password)) {
    errors.password = `8 to 16 characters, with a capital, a small letter and one of ${PASSWORD_SPECIALS}`;
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "The two passwords do not match";
  }
  return errors;
};
