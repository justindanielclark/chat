import { Sequelize, DataTypes } from "sequelize";
import ChatroomMessage from "../classes/ChatroomMessage";
import User from "../classes/User";
import Chatroom from "../classes/Chatroom";

export default function ChatroomMessageInit(sequelize: Sequelize) {
  ChatroomMessage.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
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
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, timestamps: true, tableName: "chatroomMessages" },
  );
}
