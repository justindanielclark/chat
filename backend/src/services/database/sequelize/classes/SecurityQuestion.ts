import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

class SecurityQuestion extends Model<InferAttributes<SecurityQuestion>, InferCreationAttributes<SecurityQuestion>> {
  declare id: CreationOptional<number>;
  declare question: string;
}
export default SecurityQuestion;
