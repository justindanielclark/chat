import SecurityQuestion from "../../../../../shared/types/Models/SecurityQuestion";
import { Optional } from "sequelize";

interface SecurityQuestionInput extends Optional<SecurityQuestion, "id"> {}

export { SecurityQuestionInput };
