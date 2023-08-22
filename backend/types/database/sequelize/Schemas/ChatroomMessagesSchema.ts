import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import ChatroomMessage from "../../../../../shared/types/Models/ChatroomMessage";

interface ChatroomMessageScehma
  extends ChatroomMessage,
    Model<InferAttributes<ChatroomMessageScehma>, InferCreationAttributes<ChatroomMessageScehma>> {
  id: CreationOptional<number>;
  user_id: number;
  chatroom_id: number;
  content: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export default ChatroomMessageScehma;
