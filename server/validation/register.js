import Validator from 'validator';
import isEmpty from './is-empty';

const validateRegisterInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is empty';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is empty';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'password must be at least 6 characters';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is empty';
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = ' Passwords must match';
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'confirm Password field is empty';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegisterInput;
