import {
  Association,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";

import Chatroom from "./Chatroom";
import ChatroomMessage from "./ChatroomMessage";
import ChatroomAdmin from "./ChatroomAdmin";
import ChatroomBan from "./ChatroomBan";
import ChatroomSubscription from "./ChatroomSubscription";
import SecurityQuestionAnswer from "./SecurityQuestionAnswer";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare is_active: CreationOptional<boolean>;
  declare is_online: CreationOptional<boolean>;

  declare createChatroom: HasManyCreateAssociationMixin<Chatroom, "ownerId">;
  declare getChatrooms: HasManyGetAssociationsMixin<Chatroom>; // Note the null assertions!
  declare getChatroomSubscriptions: HasManyGetAssociationsMixin<ChatroomSubscription>;

  declare chatrooms?: NonAttribute<Chatroom[]>;
  declare chatroomSubscriptions?: NonAttribute<ChatroomSubscription[]>;
  declare chatroomMessages?: NonAttribute<ChatroomMessage[]>;
  declare securityQuestionAnswers?: NonAttribute<SecurityQuestionAnswer[]>;
  declare chatroomAdmins?: NonAttribute<ChatroomAdmin[]>;
  declare chatroomBans?: NonAttribute<ChatroomBan[]>;

  declare static associations: {
    chatrooms: Association<User, Chatroom>;
    chatroomSubscriptions: Association<User, ChatroomSubscription>;
    chatroomMessages: Association<User, ChatroomMessage>;
    securityQuestionAnswers: Association<User, SecurityQuestionAnswer>;
    chatroomAdmins: Association<User, ChatroomAdmin>;
    chatroomBans: Association<User, ChatroomBan>;
  };
}

export default User;
