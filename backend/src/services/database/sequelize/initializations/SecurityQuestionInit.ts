import { Sequelize, DataTypes } from "sequelize";
import SecurityQuestion from "../classes/SecurityQuestion";

export default function SecurityQuestionInit(sequelize: Sequelize) {
  SecurityQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "securityQuestions" },
  );
}
