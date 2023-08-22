import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import User from "./User";
import SecurityQuestion from "./SecurityQuestion";

class SecurityQuestionAnswer extends Model<
  InferAttributes<SecurityQuestionAnswer>,
  InferCreationAttributes<SecurityQuestionAnswer>
> {
  declare userId: number;
  declare securityQuestionId: number;
  declare answer: string;
  declare user?: NonAttribute<User>;
  declare securityQuestion?: NonAttribute<SecurityQuestion>;
}

export default SecurityQuestionAnswer;
