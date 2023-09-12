import connParams from "./connectionParameters";
import { ForeignKeyConstraintError, Sequelize, UniqueConstraintError, ValidationError } from "sequelize";
import AtLeastOne from "../../../../../shared/types/Utils/AtLeastOne";
//Errors
import NotProvidedValidFields from "../../../utils/errors/NotProvidedValidFields";
//DataTypes
import { User, UserInput } from "../../../../../shared/types/Models/User";
import { Chatroom, ChatroomInput } from "../../../../../shared/types/Models/Chatroom";
import { ChatroomMessage, ChatroomMessageInput } from "../../../../../shared/types/Models/ChatroomMessage";
import ChatroomSubscription from "../../../../../shared/types/Models/ChatroomSubscription";
import ChatroomAdmin from "../../../../../shared/types/Models/ChatroomAdmin";
import SecurityQuestion from "../../../../../shared/types/Models/SecurityQuestion";
import SecurityQuestionAnswer from "../../../../../shared/types/Models/SecurityQuestionAnswer";
import { ChatroomBan } from "../../../../../shared/types/Models/ChatroomBan";
//Models
import ChatroomModel from "./classes/Chatroom";
import ChatroomAdminModel from "./classes/ChatroomAdmin";
import ChatroomBanModel from "./classes/ChatroomBan";
import ChatroomMessageModel from "./classes/ChatroomMessage";
import ChatroomSubscriptionModel from "./classes/ChatroomSubscription";
import SecurityQuestionModel from "./classes/SecurityQuestion";
import SecurityQuestionAnswerModel from "./classes/SecurityQuestionAnswer";
import UserModel from "./classes/User";
//Inits
import initAllModels from "./initializations/_initAll";
//Associations
import setupAssoc from "./associations/setupAssoc";
//Database Interfaces
import DatabaseFailureReasons from "../../../utils/DatabaseFailureReasons/DatabaseFailureReasons";
import DatabaseActionResultWithReturnValue, {
  DatabaseActionResult,
} from "../../../../types/database/DatabaseActionResultWithReturnValue";
import UserDatabase from "../../../../types/database/UserDatabase";
import ChatroomDatabase from "../../../../types/database/ChatroomDatabase";
import ChatroomSubscriptionDatabase from "../../../../types/database/ChatroomSubscriptionDatabase";
import ChatroomMessageDatabase from "../../../../types/database/ChatroomMessagesDatabase";
import ChatroomAdminDatabase from "../../../../types/database/ChatroomAdminDatabase";
import SecurityQuestionDatabase from "../../../../types/database/SecurityQuestionDatabase";
import SecurityQuestionAnswerDatabase from "../../../../types/database/SecurityQuestionAnswerDatabase";
import ChatroomBanDatabase from "../../../../types/database/ChatroomBanDatabase";

class SequelizeDB {
  private static _instance: DB_Instance | null;
  private constructor() {
    //Empty, never intended to be called;
  }
  public static async getInstance(): Promise<DB_Instance> {
    if (!SequelizeDB._instance) {
      SequelizeDB._instance = new DB_Instance();
      await SequelizeDB._instance.connect();
    }
    return SequelizeDB._instance;
  }
  public static clearInstance(): void {
    if (this._instance) {
      this._instance.close();
    }
    this._instance = null;
  }
}

class DB_Instance
  implements
    UserDatabase,
    ChatroomDatabase,
    ChatroomSubscriptionDatabase,
    ChatroomMessageDatabase,
    ChatroomAdminDatabase,
    SecurityQuestionDatabase,
    SecurityQuestionAnswerDatabase,
    ChatroomBanDatabase
{
  private _sequelize: Sequelize;
  public constructor() {
    this._sequelize = new Sequelize(connParams.database, connParams.username, connParams.password, {
      host: connParams.host,
      port: connParams.port,
      dialect: "mysql",
    });
    initAllModels(this._sequelize);
    setupAssoc();
  }
  public async connect(): Promise<void> {
    const isDev = process.env.NODE_ENV !== "production";
    await this._sequelize.sync({ force: isDev }); //Wipes test server if in Development Mode
  }
  public async close(): Promise<void> {
    await this._sequelize.close();
  }
  //User Database
  public async createUser(
    user: UserInput,
    securityQuestionAnswers: Array<Omit<SecurityQuestionAnswer, "userId">>,
  ): Promise<DatabaseActionResultWithReturnValue<{ user: User; answers: SecurityQuestionAnswer[] }>> {
    const transactionID = await this._sequelize.transaction();
    let newUser: UserModel;
    let answers: SecurityQuestionAnswer[] = [];
    try {
      newUser = await UserModel.create({ ...user }, { transaction: transactionID });
    } catch (err) {
      await transactionID.rollback();
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UsernameAlreadyExists,
        };
      }
      if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UsernameInvalid,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
    try {
      for (let i = 0; i < securityQuestionAnswers.length; i++) {
        const answer = await SecurityQuestionAnswerModel.create(
          {
            userId: newUser.id,
            securityQuestionId: securityQuestionAnswers[i].securityQuestionId,
            answer: securityQuestionAnswers[i].answer,
          },
          { transaction: transactionID },
        );
        answers.push(answer.dataValues);
      }
    } catch (err) {
      await transactionID.rollback();
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
    await transactionID.commit();
    return {
      success: true,
      value: {
        user: newUser.dataValues,
        answers,
      },
    };
  }
  public async retrieveUserById(id: number): Promise<DatabaseActionResultWithReturnValue<User>> {
    try {
      const retrievedUser = await UserModel.findByPk(id);
      if (retrievedUser) {
        return {
          success: true,
          value: retrievedUser.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch (err) {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveUserByName(name: string): Promise<DatabaseActionResultWithReturnValue<User>> {
    try {
      const users = await UserModel.findAll({ where: { name } });
      if (users.length === 1) {
        return {
          success: true,
          value: users[0].dataValues,
        };
      } else {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UserDoesNotExist,
        };
      }
    } catch (err) {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveUserAndAllSubscribedChatrooms(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>> {
    try {
      const result = await UserModel.findByPk(userId, {
        include: { model: ChatroomModel, association: "subscribedTo", attributes: ["name", "id"] },
      });
      if (result) {
        return {
          success: true,
          value: {
            user: result.dataValues,
            chatrooms: result.subscribedTo.map((sub) => {
              return { name: sub.dataValues.name, id: sub.dataValues.id };
            }),
          },
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveUserAndAllOwnedChatrooms(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>> {
    try {
      const result = await UserModel.findByPk(userId, {
        include: { model: ChatroomModel, association: "ownerOf", attributes: ["name", "id"] },
      });
      if (result) {
        return {
          success: true,
          value: {
            user: result.dataValues,
            chatrooms: result.subscribedTo.map((sub) => {
              return { name: sub.dataValues.name, id: sub.dataValues.id };
            }),
          },
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveUserAndAllBannedChatrooms(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>> {
    try {
      const result = await UserModel.findByPk(userId, {
        include: { model: ChatroomModel, association: "bannedFrom", attributes: ["name", "id"] },
      });
      if (result) {
        return {
          success: true,
          value: {
            user: result.dataValues,
            chatrooms: result.subscribedTo.map((sub) => {
              return { name: sub.dataValues.name, id: sub.dataValues.id };
            }),
          },
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveUserAndAllAdminChatrooms(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>> {
    try {
      const result = await UserModel.findByPk(userId, {
        include: { model: ChatroomModel, association: "adminOf", attributes: ["name", "id"] },
      });
      if (result) {
        return {
          success: true,
          value: {
            user: result.dataValues,
            chatrooms: result.subscribedTo.map((sub) => {
              return { name: sub.dataValues.name, id: sub.dataValues.id };
            }),
          },
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async updateUser(
    userId: number,
    userFieldsToUpdate: AtLeastOne<Pick<User, "is_active" | "is_online" | "name" | "password">>,
  ): Promise<DatabaseActionResultWithReturnValue<User>> {
    try {
      const isValid =
        "is_active" in userFieldsToUpdate ||
        "is_online" in userFieldsToUpdate ||
        "name" in userFieldsToUpdate ||
        "password" in userFieldsToUpdate;
      if (!isValid) throw new NotProvidedValidFields("sequelizeDatabase.ts", "updateUser()");

      if ("is_active" in userFieldsToUpdate && userFieldsToUpdate["is_active"] === false) {
        userFieldsToUpdate["is_online"] = false;
      }

      const userToUpdate = await UserModel.findByPk(userId);
      if (userToUpdate) {
        const updatedUser = await userToUpdate.update({
          ...userFieldsToUpdate,
        });
        return {
          success: true,
          value: updatedUser.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UsernameAlreadyExists,
        };
      }
      if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UsernameInvalid,
        };
      }
      if (err instanceof NotProvidedValidFields) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.NotProvidedValidFields,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //Chatroom Database
  public async createChatroom(chatroom: ChatroomInput): Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      subscription: ChatroomSubscription;
      admin: ChatroomAdmin;
    }>
  > {
    const transactionID = await this._sequelize.transaction();
    let createdChatroom: ChatroomModel;
    let createdSubscription: ChatroomSubscriptionModel;
    let createdAdmin: ChatroomAdminModel;
    try {
      createdChatroom = await ChatroomModel.create({ ...chatroom });
    } catch (err) {
      await transactionID.rollback();
      if (err instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.UserDoesNotExist,
        };
      }
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomNameAlreadyExists,
        };
      }
      if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
    try {
      createdSubscription = await ChatroomSubscriptionModel.create({
        chatroomId: createdChatroom.id,
        userId: createdChatroom.ownerId,
      });
    } catch {
      await transactionID.rollback();
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
    try {
      createdAdmin = await ChatroomAdminModel.create({ chatroomId: createdChatroom.id, userId: chatroom.ownerId });
    } catch {
      await transactionID.rollback();
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
    await transactionID.commit();
    return {
      success: true,
      value: {
        chatroom: createdChatroom.dataValues,
        admin: createdAdmin.dataValues,
        subscription: createdSubscription.dataValues,
      },
    };
  }
  public async retrieveAllChatrooms(): Promise<DatabaseActionResultWithReturnValue<Chatroom[]>> {
    try {
      const chatrooms = (await ChatroomModel.findAll()).map((chatroom) => chatroom.dataValues);
      return {
        success: true,
        value: chatrooms,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveChatroomById(id: number): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    try {
      const retrievedChatroom = await ChatroomModel.findByPk(id);
      if (retrievedChatroom) {
        return {
          success: true,
          value: retrievedChatroom,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveChatroomWithAllSubscribers(id: number): Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      users: Omit<User, "password" | "createdAt" | "updatedAt">[];
    }>
  > {
    try {
      const result = await ChatroomModel.findByPk(1, {
        include: {
          model: UserModel,
          association: "subscribers",
        },
      });
      if (result) {
        const { subscribers: subs } = result;

        return {
          success: true,
          value: {
            chatroom: result.dataValues,
            users: subs.map((sub) => {
              return {
                id: sub.dataValues.id,
                name: sub.dataValues.name,
                is_active: sub.dataValues.is_active,
                is_online: sub.dataValues.is_online,
              };
            }),
          },
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async updateChatroom(
    id: number,
    chatroomFieldsToUpdate: AtLeastOne<Pick<Chatroom, "name" | "password">>,
  ): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    try {
      const isValid = "name" in chatroomFieldsToUpdate || "password" in chatroomFieldsToUpdate;
      if (!isValid) throw new NotProvidedValidFields("sequelizeDatabase.ts", "updateChatroom()");
      const chatroomToUpdate = await ChatroomModel.findByPk(id);
      if (chatroomToUpdate) {
        const updatedChatroom = await chatroomToUpdate.update({ ...chatroomFieldsToUpdate });
        return {
          success: true,
          value: updatedChatroom.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomDoesNotExist,
      };
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomNameAlreadyExists,
        };
      }
      if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation,
        };
      }
      if (err instanceof NotProvidedValidFields) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.NotProvidedValidFields,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteChatroomById(id: number): Promise<DatabaseActionResult> {
    try {
      const deletedChatroom = await ChatroomModel.destroy({ where: { id } });
      if (deletedChatroom > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //ChatroomSubscription Database
  public async createChatroomSubscription(
    chatroomSubscription: ChatroomSubscription,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription>> {
    try {
      const createdChatroomSubscription = await ChatroomSubscriptionModel.create({ ...chatroomSubscription });
      return {
        success: true,
        value: createdChatroomSubscription.dataValues,
      };
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomSubscriptionIsNotUnique,
        };
      }
      if (err instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveChatroomSubscriptionsByChatroomId(
    chatroomId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription[]>> {
    try {
      const retrievedChatrooms = await ChatroomSubscriptionModel.findAll({
        where: { chatroomId },
      });
      if (retrievedChatrooms.length > 0) {
        return {
          success: true,
          value: retrievedChatrooms.map((chatroom) => chatroom.dataValues),
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveChatroomSubscriptionsByUserId(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription[]>> {
    try {
      const retrievedChatrooms = await ChatroomSubscriptionModel.findAll({
        where: { userId },
      });
      if (retrievedChatrooms.length > 0) {
        return {
          success: true,
          value: retrievedChatrooms.map((chatroom) => chatroom.dataValues),
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteChatroomSubscription(chatroomSubscription: ChatroomSubscription): Promise<DatabaseActionResult> {
    try {
      const deletedChatroomSubscription = await ChatroomSubscriptionModel.destroy({
        where: { ...chatroomSubscription },
      });
      if (deletedChatroomSubscription > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async verifyChatroomSubscription(chatroomSubscription: ChatroomSubscription): Promise<DatabaseActionResult> {
    try {
      const retrievedChatroom = await ChatroomSubscriptionModel.findOne({
        where: { ...chatroomSubscription },
      });
      if (retrievedChatroom) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //ChatroomMessages Database
  public async createChatroomMessage(
    message: ChatroomMessageInput,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>> {
    try {
      const newMessage = await ChatroomMessageModel.create({ ...message });
      return {
        success: true,
        value: newMessage.dataValues,
      };
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllChatroomMessages(
    chatroomId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage[]>> {
    try {
      const allMessages = await ChatroomMessageModel.findAll({
        where: { chatroomId },
      });
      if (allMessages.length > 0) {
        return {
          success: true,
          value: allMessages,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomMessageDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveChatroomMessage(
    messageID: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>> {
    try {
      const message = await ChatroomMessageModel.findByPk(messageID);
      if (message) {
        return {
          success: true,
          value: message.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomMessageDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomMessageDoesNotExist,
      };
    }
  }
  //! To Implement
  public async updateChatroomMessage(
    messageId: number,
    messageFieldsToUpdate: Partial<Pick<ChatroomMessage, "content" | "updatedAt">>,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>> {
    return {
      success: false,
      failure_id: "1",
    };
  }
  public async deleteChatroomMessage(messageId: number): Promise<DatabaseActionResult> {
    try {
      const messageToDelete = await ChatroomMessageModel.destroy({
        where: { id: messageId },
      });
      if (messageToDelete > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomMessageDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //ChatroomAdmin Database
  public async createChatroomAdmin(
    chatroomAdmin: ChatroomAdmin,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin>> {
    try {
      const newChatroomAdmin = await ChatroomAdminModel.create({
        ...chatroomAdmin,
      });
      return {
        success: true,
        value: newChatroomAdmin.dataValues,
      };
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure,
        };
      }
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomAdminAlreadyExists,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllChatroomAdminsByChatroomId(
    chatroomId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin[]>> {
    try {
      const foundChatrooms = await ChatroomAdminModel.findAll({
        where: { chatroomId },
      });
      if (foundChatrooms.length > 0) {
        return {
          success: true,
          value: foundChatrooms.map((item) => item.dataValues),
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomAdminDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllChatroomAdminsByUserId(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin[]>> {
    try {
      const foundChatrooms = await ChatroomAdminModel.findAll({
        where: { userId },
      });
      if (foundChatrooms.length > 0) {
        return {
          success: true,
          value: foundChatrooms.map((item) => item.dataValues),
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomAdminDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteChatroomAdmin(chatroomAdmin: ChatroomAdmin): Promise<DatabaseActionResult> {
    try {
      const deleted = await ChatroomAdminModel.findOne({
        where: { ...chatroomAdmin },
      });
      if (deleted) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomAdminDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //ChatroomBan Database
  public async createChatroomBan(chatroomBan: ChatroomBan): Promise<DatabaseActionResultWithReturnValue<ChatroomBan>> {
    try {
      const result = await ChatroomBanModel.create({ ...chatroomBan });
      return {
        success: true,
        value: result.dataValues,
      };
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure,
        };
      }
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.ChatroomBanAlreadyExists,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllChatroomBansByUserId(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomBan[]>> {
    try {
      const results = await ChatroomBanModel.findAll({ where: { userId } });
      if (results.length > 0) {
        return {
          success: true,
          value: results.map((r) => r.dataValues),
        };
      }
      return { success: false, failure_id: DatabaseFailureReasons.ChatroomBanDoesNotExist };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllChatroomBansByChatroomId(
    chatroomId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomBan[]>> {
    try {
      const results = await ChatroomBanModel.findAll({ where: { chatroomId } });
      if (results.length > 0) {
        return {
          success: true,
          value: results.map((r) => r.dataValues),
        };
      }
      return { success: false, failure_id: DatabaseFailureReasons.ChatroomBanDoesNotExist };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteChatroomBan(chatroomBan: ChatroomBan): Promise<DatabaseActionResult> {
    try {
      const result = await ChatroomBanModel.destroy({ where: { ...chatroomBan } });
      if (result > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.ChatroomBanDoesNotExist,
      };
    } catch (err) {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //SecurityQuestion Database
  public async createSecurityQuestion(
    question: string,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>> {
    try {
      const createdQuestion = await SecurityQuestionModel.create({ question });
      return {
        success: true,
        value: createdQuestion.dataValues,
      };
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: DatabaseFailureReasons.SecurityQuestionIsNotUnique,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllSecurityQuestions(): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion[]>> {
    try {
      const securityQuestions = await SecurityQuestionModel.findAll();
      return {
        success: true,
        value: securityQuestions.map((item) => item.dataValues),
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveSecurityQuestionById(
    id: number,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>> {
    try {
      const retrievedQuestion = await SecurityQuestionModel.findByPk(id);
      if (retrievedQuestion) {
        return {
          success: true,
          value: retrievedQuestion.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.SecurityQuestionDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  //SecurityQuestionAnswer Database
  public async retrieveSecurityQuestionAnswerByIds(
    userId: number,
    securityQuestionId: number,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestionAnswer>> {
    try {
      const retrievedQuestionAnswer = await SecurityQuestionAnswerModel.findOne({
        where: { userId, securityQuestionId },
      });
      if (retrievedQuestionAnswer) {
        return {
          success: true,
          value: retrievedQuestionAnswer.dataValues,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retrieveAllSecurityQuestionsAnswersByUserId(
    userId: number,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestionAnswer[]>> {
    try {
      const retrievedSecurityQuestions = await SecurityQuestionAnswerModel.findAll({ where: { userId } });
      if (retrievedSecurityQuestions.length > 0) {
        return {
          success: true,
          value: retrievedSecurityQuestions.map((item) => item.dataValues),
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UserDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteSecurityQuestionByAnswerByIds(
    userId: number,
    securityQuestionId: number,
  ): Promise<DatabaseActionResult> {
    try {
      const deletedSecurityQuestion = await SecurityQuestionAnswerModel.destroy({
        where: { userId, securityQuestionId },
      });
      if (deletedSecurityQuestion > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async deleteAllSecurityQuestionsAnswerByUserId(userId: number): Promise<DatabaseActionResult> {
    try {
      const deletedSecurityQuestions = await SecurityQuestionAnswerModel.destroy({ where: { userId } });
      if (deletedSecurityQuestions > 0) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        failure_id: DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
}

export default SequelizeDB;
export { SequelizeDB, DB_Instance };
