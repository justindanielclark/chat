import { Sequelize, DataTypes } from "sequelize";
import ChatroomBan from "../classes/ChatroomBan";
import User from "../classes/User";
import Chatroom from "../classes/Chatroom";

function ChatroomBanInit(sequelize: Sequelize) {
  ChatroomBan.init(
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
    { sequelize, timestamps: false, tableName: "chatroomBans" },
  );
}

export default ChatroomBanInit;
