import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";

import User from "./User";
import ChatroomMessage from "./ChatroomMessage";

class Chatroom extends Model<InferAttributes<Chatroom>, InferCreationAttributes<Chatroom>> {
  declare id: CreationOptional<number>;
  // declare ownerId: ForeignKey<User["id"]>;
  declare ownerId: number;
  declare name: string;
  declare password: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ownedBy: NonAttribute<User>;
  declare subscribers: NonAttribute<User[]>;
  declare bans: NonAttribute<User[]>;
  declare admins: NonAttribute<User[]>;

  declare messages: NonAttribute<ChatroomMessage[]>;
}
export default Chatroom;
