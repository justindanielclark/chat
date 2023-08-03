import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import User from "../../../../../shared/types/Models/User";

interface UserSchema extends User, Model<InferAttributes<UserSchema>, InferCreationAttributes<UserSchema>> {
  id: CreationOptional<number>;
  username: string;
  password: string;
  profile: CreationOptional<string>;
  security_question_1_id: number; //FK
  security_answer_1: string;
  security_question_2_id: number; //FK
  security_answer_2: string;
  security_question_3_id: number; //FK
  security_answer_3: string;
  currently_online: CreationOptional<boolean>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export default UserSchema;
