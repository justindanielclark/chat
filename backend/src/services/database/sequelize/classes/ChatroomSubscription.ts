import { Model, InferAttributes, InferCreationAttributes, NonAttribute } from "sequelize";
import User from "./User";
import Chatroom from "./Chatroom";
class ChatroomSubscription extends Model<
  InferAttributes<ChatroomSubscription>,
  InferCreationAttributes<ChatroomSubscription>
> {
  // declare userId: ForeignKey<User["id"]>;
  // declare chatroomId: ForeignKey<Chatroom["id"]>;
  declare userId: number;
  declare chatroomId: number;
  declare user?: NonAttribute<User>;
  declare chatroom?: NonAttribute<Chatroom>;
}
export default ChatroomSubscription;
