import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import Chatroom from "../../../../../shared/types/Models/Chatroom";

interface ChatroomSchema
  extends Chatroom,
    Model<InferAttributes<ChatroomSchema>, InferCreationAttributes<ChatroomSchema>> {
  id: CreationOptional<number>;
  name: string;
  creator_id: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export default ChatroomSchema;
