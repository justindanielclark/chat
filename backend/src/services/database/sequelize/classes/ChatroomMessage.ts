import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import User from "./User";
import Chatroom from "./Chatroom";
class ChatroomMessage extends Model<InferAttributes<ChatroomMessage>, InferCreationAttributes<ChatroomMessage>> {
  declare id: CreationOptional<number>;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  // declare userId: ForeignKey<User["id"]>;
  // declare chatroomId: ForeignKey<Chatroom["id"]>;
  declare userId: number;
  declare chatroomId: number;

  declare user?: NonAttribute<User>;
  declare chatroom?: NonAttribute<Chatroom>;
}
export default ChatroomMessage;
