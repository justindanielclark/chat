import dotenv from "dotenv";
import SequelizeDbConnection from "./src/services/database/sequelize/sequelizeDbConnection";
import User from "../shared/types/Models/User";

dotenv.config();

async function main() {
  const db = await SequelizeDbConnection.getInstance();
  await db.initialize();
  //CREATE USER
  // const newUser: Omit<User, "id" | "createdAt" | "updatedAt" | "profile" | "currently_online"> = {
  //   username: "Natasha",
  //   password: "Lavygina",
  //   security_answer_1: "test security answer 1",
  //   security_answer_2: "test security answer 2",
  //   security_answer_3: "test security answer 3",
  //   security_question_1_id: 1,
  //   security_question_2_id: 2,
  //   security_question_3_id: 3,
  // };
  // await db.createUser(newUser);

  //RETRIEVE USER
  // const result = await db.retrieveUserByUsername("Justin");
  // const result = await db.retrieveUserByUsername("Justin");

  //UPDATE USER
  const updatedUser: Omit<User, "createdAt"> = {
    id: 2,
    username: "Frankie",
    password: "Lavygina",
    security_answer_1: "test security answer 1",
    security_answer_2: "test security answer 2",
    security_answer_3: "test security answer 3",
    security_question_1_id: 1,
    security_question_2_id: 2,
    security_question_3_id: 3,
    currently_online: true,
    profile: "This is a profile",
    updatedAt: new Date(),
  };
  const results = await db.updateUser(updatedUser);

  await db.close();
}

main();
