const DatabaseFailureReasons = {
  UnknownError: "Unknown Database Connection Error",
  NotProvidedValidFields: "Not Provided Valid Fields To Complete Transaction",
  ForeignKeyConstraintFailure: "Foreign Key Is Not Able To Be Found",
  //User Errors
  UsernameInvalid: "Username Does Not Meet Requirements",
  PasswordInvalid: "Password Does Not Meet Requirements",
  UsernameAlreadyExists: "User Name Must Be Unique",
  UserDoesNotExist: "User Does Not Exist For That Parameter",
  //Chatroom Errors
  ChatroomDoesNotExist: "Chatroom Does Not Exist For That Parameter",
  ChatroomNameFailsValidation: "Chatroom Name Does Not Pass Validation Requirements",
  ChatroomNameAlreadyExists: "Chatroom Name Must Be Unique",
  //Chatroom Subscription
  ChatroomSubscriptionIsNotUnique: "Chatroom Subscription Is Not Unique",
  ChatroomSubscriptionDoesNotExist: "Chatroom Subscriptions Do Not Exist For Those Parameters",
  //Chatroom Message
  ChatroomMessageDoesNotExist: "Chatroom Message For That Id Does Not Exist For Those Parameters",
  //ChatroomAdmin
  ChatroomAdminDoesNotExist: "Chatroom Admin Does Not Exist For Those Parameters",
  ChatroomAdminAlreadyExists: "Chatroom Admin Already Exists With Those Parameters",
  //SecurityQuestion
  SecurityQuestionIsNotUnique: "Security Question Is Not Unique",
  SecurityQuestionDoesNotExist: "Security Question Does Not Exist For That Parameter",
  //SecurityQuestionAnswer
  SecurityQuestionAnswerDoesNotExist: "Security Question Does Not Exist For Those Parameters",
};
export default DatabaseFailureReasons;
