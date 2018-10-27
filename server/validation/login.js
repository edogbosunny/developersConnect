import Validator from 'validator';
import isEmpty from './is-empty';

const validateLoginInput = (data) => {
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

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

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateLoginInput;
