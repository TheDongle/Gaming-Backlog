const passwordValidation = {
  pattern: "^(?=.*[A-Za-z])(?=.*[\\d])\\S{8,32}$",
  message:
    "Password must be 8 - 32 characters, with no spaces, at least one letter, and at least one number.",
};

const usernameValidation = {
  pattern: "^\\S{8,32}$",
  message: "Username must be 8 - 32 characters, with no spaces.",
};

const playStyleValidation = {
  pattern: "^(completionist|casual)$",
  message: "Playstyle can only be 'casual' or 'completionist'",
};

export { passwordValidation, usernameValidation, playStyleValidation };
