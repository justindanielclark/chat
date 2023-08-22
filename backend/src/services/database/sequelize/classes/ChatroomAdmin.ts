import { Model, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import User from "./User";
import Chatroom from "./Chatroom";

class ChatroomAdmin extends Model<InferAttributes<ChatroomAdmin>, InferCreationAttributes<ChatroomAdmin>> {
  declare userId: number;
  declare chatroomId: number;
  declare user?: NonAttribute<User>;
  declare chatroom?: NonAttribute<Chatroom>;
}
export default ChatroomAdmin;
