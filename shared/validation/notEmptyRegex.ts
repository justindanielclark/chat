import RegexValidation from "../types/RegexValidation";
const notEmptyRegex: RegexValidation = {
  regex: /^.{1,120}$/,
  requirements: [
    "Message must be at leats 1 character",
    "Message cannot be longer than 120 characters",
  ],
};
export default notEmptyRegex;
