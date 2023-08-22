import RegexValidation from "../types/RegexValidation";
const passwordRegex: RegexValidation = {
  regex:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\[\]{}|\\:;"'<,>.?/=_+]).{5,20}$/,
  requirements: [
    "The password must contain at least one uppercase letter ([A-Z]).",
    "The password must contain at least one lowercase letter ([a-z]).",
    "The password must contain at least one special character from the set !@#$%^&*()[]{}|:;\"'<,>.?/=_+.",
    "The password must be between 5 and 20 characters in length.",
  ],
};
