import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";
import DatabaseActionResultWithReturnValue from "./DatabaseActionResultWithReturnValue";

interface SecurityQuestionDatabase {
  retrieveSecurityQuestionById: (id: number) => DatabaseActionResultWithReturnValue<SecurityQuestion>;
}

export default SecurityQuestionDatabase;
