import SecurityQuestionAnswer from "../../../shared/types/Models/SecurityQuestionAnswer";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface SecurityQuestionAnswerDatabase {
  retrieveSecurityQuestionAnswerByIds: (
    userId: number,
    securityQuestionId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestionAnswer>>;
  retrieveAllSecurityQuestionsAnswersByUserId: (userId: number) => Promise<DatabaseActionResultWithReturnValue<SecurityQuestionAnswer[]>>;
  deleteSecurityQuestionByAnswerByIds: (userId: number, securityQuestionId: number) => Promise<DatabaseActionResult>;
  deleteAllSecurityQuestionsAnswerByUserId: (userId: number) => Promise<DatabaseActionResult>;
}

export default SecurityQuestionAnswerDatabase;
