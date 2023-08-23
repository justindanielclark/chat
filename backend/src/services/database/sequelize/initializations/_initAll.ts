import ChatroomInit from "./ChatroomInit";
import ChatroomAdminInit from "./ChatroomAdminInit";
import ChatroomBanInit from "./ChatroomBanInit";
import ChatroomMessageInit from "./ChatroomMessageInit";
import ChatroomSubscriptionInit from "./ChatroomSubscriptionInit";
import SecurityQuestionInit from "./SecurityQuestionInit";
import SecurityQuestionAnswerInit from "./SecurityQuestionAnswerInit";
import UserInit from "./UserInit";
import { Sequelize } from "sequelize";

export default function initAll(sequelize: Sequelize): void {
  UserInit(sequelize);
  ChatroomInit(sequelize);
  ChatroomAdminInit(sequelize);
  ChatroomBanInit(sequelize);
  ChatroomMessageInit(sequelize);
  ChatroomSubscriptionInit(sequelize);
  SecurityQuestionInit(sequelize);
  SecurityQuestionAnswerInit(sequelize);
}
