const DatabaseFailureReasons = {
  UnknownError: "Unknown Database Connection Error",
  //User Errors
  UsernameInvalid: "Username does not meet requirements",
  PasswordInvalid: "Password does not meet requirements",
  UsernameAlreadyExists: "Username is not unique",
  UserDoesNotExist: "User does not exist",
};
export default DatabaseFailureReasons;
