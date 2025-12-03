// Validazione username
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username è obbligatorio';
  }
  if (username.length < 3) {
    return 'Username deve essere di almeno 3 caratteri';
  }
  return null;
};

// Validazione password
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password è obbligatoria';
  }
  if (password.length < 6) {
    return 'Password deve essere di almeno 6 caratteri';
  }
  return null;
};

// Validazione form login
export const validateLoginForm = (username, password) => {
  const errors = {};
  
  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
