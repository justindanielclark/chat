import { Sequelize, DataTypes } from "sequelize";
import ChatroomSubscription from "../classes/ChatroomSubscription";
import User from "../classes/User";
import Chatroom from "../classes/Chatroom";

export default function ChatroomSubscriptionInit(sequelize: Sequelize) {
  ChatroomSubscription.init(
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
      chatroomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Chatroom,
          key: "id",
        },
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "chatroomSubscriptions" },
  );
}
