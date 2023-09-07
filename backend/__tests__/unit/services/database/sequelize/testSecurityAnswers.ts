import SecurityQuestionAnswer from "../../../../../../shared/types/Models/SecurityQuestionAnswer";

const answers: Omit<SecurityQuestionAnswer, "userId">[] = [
  { securityQuestionId: 1, answer: "A cool answer to a cool question" },
  { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
  { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
];

export default answers;
