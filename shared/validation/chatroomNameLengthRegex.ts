import RegexValidation from "../types/RegexValidation";
const messageLengthRegex: RegexValidation = {
  regex: /^.{3,40}$/,
  requirements: [
    "Message must be at leats 1 character",
    "Message cannot be longer than 120 characters",
  ],
};
export default messageLengthRegex;
