import {
  Association,
  HasManyGetAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

import User from "./User";
import ChatroomMessage from "./ChatroomMessage";
import ChatroomAdmin from "./ChatroomAdmin";
import ChatroomBan from "./ChatroomBan";
import ChatroomSubscription from "./ChatroomSubscription";

class Chatroom extends Model<InferAttributes<Chatroom>, InferCreationAttributes<Chatroom>> {
  declare id: CreationOptional<number>;
  // declare ownerId: ForeignKey<User["id"]>;
  declare ownerId: number;
  declare name: string;
  declare password: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare owner?: NonAttribute<User>;
  declare chatroomMessages?: NonAttribute<ChatroomMessage[]>;
  declare chatroomAdmins?: NonAttribute<ChatroomAdmin[]>;
  declare chatroomBans?: NonAttribute<ChatroomBan[]>;

  declare getChatroomMessages: HasManyGetAssociationsMixin<ChatroomMessage>;

  declare static associations: {
    chatroomSubscriptions: Association<Chatroom, ChatroomSubscription>;
    chatroomMessages: Association<Chatroom, ChatroomMessage>;
    chatroomAdmins: Association<Chatroom, ChatroomAdmin>;
    chatroomBans: Association<Chatroom, ChatroomBan>;
  };
}
export default Chatroom;
