import { Model, InferAttributes, InferCreationAttributes } from "sequelize";

class SecurityQuestion extends Model<InferAttributes<SecurityQuestion>, InferCreationAttributes<SecurityQuestion>> {
  declare id: number;
  declare question: string;
}
export default SecurityQuestion;
