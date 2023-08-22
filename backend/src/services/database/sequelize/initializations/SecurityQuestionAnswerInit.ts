import { Sequelize, DataTypes } from "sequelize";
import SecurityQuestionAnswer from "../classes/SecurityQuestionAnswer";
import User from "../classes/User";
import SecurityQuestion from "../classes/SecurityQuestion";

export default function SecurityQuestionAnswerInit(sequelize: Sequelize) {
  SecurityQuestionAnswer.init(
    //Composite PK
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      securityQuestionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: SecurityQuestion,
          key: "id",
        },
        allowNull: false,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "securityQuestionAnswers" },
  );
}
