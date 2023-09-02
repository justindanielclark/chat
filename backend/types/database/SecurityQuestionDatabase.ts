import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";
import DatabaseActionResultWithReturnValue from "./DatabaseActionResultWithReturnValue";
import { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";

interface SecurityQuestionDatabase {
  createSecurityQuestion: (question: string) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>>;
  retrieveAllSecurityQuestions: () => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion[]>>;
  retrieveSecurityQuestionById: (id: number) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>>;
}

export default SecurityQuestionDatabase;
