import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";
import DatabaseActionResultWithReturnValue from "./DatabaseActionResultWithReturnValue";
import { SecurityQuestionInput } from "./sequelize/Inputs/SecurityQuestionInput";

interface SecurityQuestionDatabase {
  createSecurityQuestion: (
    question: SecurityQuestionInput,
  ) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>>;
  retrieveAllSecurityQuestions: () => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion[]>>;
  retrieveSecurityQuestionById: (id: number) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>>;
}

export default SecurityQuestionDatabase;
