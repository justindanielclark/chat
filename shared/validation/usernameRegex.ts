import RegexValidation from "../types/RegexValidation";
const userNameRegex: RegexValidation = {
  regex: /^(?=.*[a-zA-Z]).{5,20}$/,
  requirements: [
    "The username must contain at least one alphabetical character (uppercase or lowercase).",
    "The username must be between 5 and 20 characters in length.",
  ],
};

export default userNameRegex;
