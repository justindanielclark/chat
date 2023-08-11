import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";

const securityQuestions: Array<Omit<SecurityQuestion, "id">> = [
  { question: "What was the name of your first grade teacher" },
  { question: "What was the color of your first car" },
  { question: "What was the name of the street you lived on when you were 10 years old" },
  { question: "What is the name of your paternal grandmother?" },
  { question: "What is the name of your paternal grandfather?" },
  { question: "What is the name of your maternal grandmother?" },
  { question: "What is the name of your maternal grandfather?" },
  { question: "What is the name of your eldest cousin?" },
  { question: "What high school did you graduate from?" },
  { question: "What is your favorite movie?" },
  { question: "What was the mascot at your highscool?" },
  { question: "What was the name of your first boyfriend/girlfriend?" },
  { question: "What was the make of your first car?" },
  { question: "In what city were you born?" },
  { question: "Which is your favorite sports team?" },
  { question: "What is your favorite Olympic summer event?" },
  { question: "What is your favorite Olympic winter event?" },
  { question: "What is the name of your favorite restraunt?" },
  { question: "Which location was your favorite to travel to?" },
  { question: "What is your favorite color?" },
];

export default securityQuestions;
