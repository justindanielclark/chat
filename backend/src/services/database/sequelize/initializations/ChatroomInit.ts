import { Sequelize, DataTypes } from "sequelize";
import User from "../classes/User";
import Chatroom from "../classes/Chatroom";

function ChatroomInit(sequelize: Sequelize) {
  Chatroom.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, timestamps: true, tableName: "chatrooms" },
  );
}
export default ChatroomInit;
