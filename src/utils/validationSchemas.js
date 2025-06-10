export const createUserValidationSchema = {
  username: {
    isString: {
      errorMessage: "Username must be a string"
    },
    notEmpty: {
      errorMessage: "Username cannot be empty"
    },
    isLength: {
      options: { min: 5, max: 32 },
      errorMessage: "Username must be 5-32 characters"
    },
    // Optional: Add sanitization
    trim: true,
    escape: true
  },
  displayName: {
    isString: {
      errorMessage: "Display name must be a string"
    },
    notEmpty: {
      errorMessage: "Display name cannot be empty"
    },
    optional: true, // Only if displayName is optional
    // Optional: Add sanitization
    trim: true
  }
};