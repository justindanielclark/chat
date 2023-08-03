import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import SecurityQuestion from "../../../../../shared/types/Models/SecurityQuestion";

interface SecurityQuestionSchema
  extends SecurityQuestion,
    Model<InferAttributes<SecurityQuestionSchema>, InferCreationAttributes<SecurityQuestionSchema>> {
  id: CreationOptional<number>;
  question: string;
}

export default SecurityQuestionSchema;
