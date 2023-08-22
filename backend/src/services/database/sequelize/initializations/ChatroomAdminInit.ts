import ChatroomAdmin from "../classes/ChatroomAdmin";
import Chatroom from "../classes/Chatroom";
import User from "../classes/User";
import { Sequelize, DataTypes } from "sequelize";

function ChatroomAdminInit(sequelize: Sequelize) {
  ChatroomAdmin.init(
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
    { sequelize, timestamps: false, tableName: "chatroomAdmins" },
  );
}

export default ChatroomAdminInit;
