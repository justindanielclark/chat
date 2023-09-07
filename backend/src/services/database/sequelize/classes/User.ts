import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";

import Chatroom from "./Chatroom";
import ChatroomMessage from "./ChatroomMessage";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare is_active: CreationOptional<boolean>;
  declare is_online: CreationOptional<boolean>;

  declare ownerOf: NonAttribute<Chatroom[]>;
  declare bannedFrom: NonAttribute<Chatroom[]>;
  declare subscribedTo: NonAttribute<Chatroom[]>;
  declare adminOf: NonAttribute<Chatroom[]>;
  declare writerOf: NonAttribute<ChatroomMessage[]>;
}

export default User;
