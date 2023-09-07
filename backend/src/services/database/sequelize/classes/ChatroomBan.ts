import { Model, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import User from "./User";
import Chatroom from "./Chatroom";

class ChatroomBan extends Model<InferAttributes<ChatroomBan>, InferCreationAttributes<ChatroomBan>> {
  declare userId: number;
  declare chatroomId: number;
  declare user?: NonAttribute<User>;
  declare chatroom?: NonAttribute<Chatroom>;
}

export { ChatroomBan };
export default ChatroomBan;
