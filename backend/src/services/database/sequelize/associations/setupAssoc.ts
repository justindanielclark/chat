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
    as: "chatrooms",
  });
  User.hasMany(ChatroomMessage, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "chatroomMessages",
  });
  User.belongsToMany(Chatroom, { through: ChatroomSubscription, as: "chatroomSubscriptions", foreignKey: "userId" });
  User.belongsToMany(Chatroom, { through: ChatroomAdmin, as: "chatroomAdmins", foreignKey: "userId" });
  User.belongsToMany(Chatroom, { through: ChatroomBan, as: "chatroomBans", foreignKey: "userId" });
  User.belongsToMany(SecurityQuestion, {
    through: SecurityQuestionAnswer,
    as: "securityQuestionAnswers",
    foreignKey: "userId",
  });

  Chatroom.hasMany(ChatroomMessage, {
    sourceKey: "id",
    foreignKey: "chatroomId",
    as: "chatroomMessages",
  });
  Chatroom.belongsToMany(User, {
    through: ChatroomSubscription,
    as: "chatroomSubscriptions",
    foreignKey: "chatroomId",
  });
  Chatroom.belongsToMany(User, { through: ChatroomAdmin, as: "chatroomAdmins", foreignKey: "chatroomId" });
  Chatroom.belongsToMany(User, { through: ChatroomBan, as: "chatroomBans", foreignKey: "chatroomId" });

  SecurityQuestion.belongsToMany(User, {
    through: SecurityQuestionAnswer,
    as: "securityQuestionAnswers",
    foreignKey: "securityQuestionId",
  });
}
