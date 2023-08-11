import SequelizeDbConnection from "./sequelizeDbConnection";
import securityQuestions from "../../../data/securityQuestions";

export default async function seedSecurityQuestions() {
  const db = await SequelizeDbConnection.getInstance();
  await Promise.all(securityQuestions.map((question) => db.createSecurityQuestion(question)));
  return;
}
