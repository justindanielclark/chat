import User from "../classes/User";
import Chatroom from "../classes/Chatroom";
import ChatroomMessage from "../classes/ChatroomMessage";
import ChatroomSubscription from "../classes/ChatroomSubscription";
import ChatroomAdmin from "../classes/ChatroomAdmin";
import ChatroomBan from "../classes/ChatroomBan";
import SecurityQuestion from "../classes/SecurityQuestion";
import SecurityQuestionAnswer from "../classes/SecurityQuestionAnswer";

export default function setupAssoc() {
  User.hasMany(Chatroom, {
    sourceKey: "id",
    foreignKey: "ownerId",
    as: "ownerOf",
  });
  User.hasMany(ChatroomMessage, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "writerOf",
  });
  User.belongsToMany(Chatroom, {
    through: ChatroomSubscription,
    as: "subscribedTo",
    foreignKey: "userId",
  });
  User.belongsToMany(Chatroom, { through: ChatroomAdmin, as: "adminOf", foreignKey: "userId" });
  User.belongsToMany(Chatroom, { through: ChatroomBan, as: "bannedFrom", foreignKey: "userId" });

  User.belongsToMany(SecurityQuestion, {
    through: SecurityQuestionAnswer,
    as: "securityQuestionAnswer_user",
    foreignKey: "userId",
  });
  Chatroom.hasMany(ChatroomMessage, {
    sourceKey: "id",
    foreignKey: "chatroomId",
    as: "chatroomMessages",
  });
  Chatroom.belongsToMany(User, {
    through: ChatroomSubscription,
    as: "subscribers",
    foreignKey: "chatroomId",
  });
  Chatroom.belongsToMany(User, { through: ChatroomAdmin, as: "chatroomAdmin_chatroom", foreignKey: "chatroomId" });
  Chatroom.belongsToMany(User, { through: ChatroomBan, as: "chatroomBan_chatroom", foreignKey: "chatroomId" });

  SecurityQuestion.belongsToMany(User, {
    through: SecurityQuestionAnswer,
    as: "securityQuestionAnswer_securityQuestion",
    foreignKey: "securityQuestionId",
  });
}
