import connParams from "./connectionParameters";
import { Sequelize, UniqueConstraintError, ValidationError } from "sequelize";
//DataTypes
import { User, UserInput } from "../../../../../shared/types/Models/User";
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
import Chatroom, { ChatroomInput } from "../../../../../shared/types/Models/Chatroom";
import { create } from "domain";
import ChatroomSubscriptionDatabase from "../../../../types/database/ChatroomSubscriptionDatabase";
import ChatroomSubscription from "../../../../../shared/types/Models/ChatroomSubscription";
import ChatroomMessageDatabase from "../../../../types/database/ChatroomMessagesDatabase";

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

class DB_Instance implements UserDatabase, ChatroomDatabase, ChatroomSubscriptionDatabase, ChatroomMessageDatabase {
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
  public async createUser(user: UserInput): Promise<DatabaseActionResultWithReturnValue<User>> {
    try {
      const newUser = await UserModel.create({ ...user });
      return {
        success: true,
        value: newUser.dataValues,
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
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
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
  public async updateUser(
    userId: number,
    userFieldsToUpdate: Partial<User>,
  ): Promise<DatabaseActionResultWithReturnValue<User>> {
    return {
      success: false,
      failure_id: "1",
    };
  }
  //Chatroom Database
  public async createChatroom(chatroom: ChatroomInput): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    try {
      const createdChatroom = await ChatroomModel.create({ ...chatroom });
      return {
        success: true,
        value: createdChatroom.dataValues,
      };
    } catch {
      return {
        success: false,
        failure_id: DatabaseFailureReasons.UnknownError,
      };
    }
  }
  public async retreiveAllChatrooms(): Promise<DatabaseActionResultWithReturnValue<Chatroom[]>> {
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
  public async updateChatroom(
    id: number,
    chatroomFieldsToUpdate: Partial<Pick<Chatroom, "name" | "password">>,
  ): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    return {
      success: false,
      failure_id: "1",
    };
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
    } catch {
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
      const retrievedChatrooms = await ChatroomSubscriptionModel.findAll({ where: { chatroomId } });
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
      const retrievedChatrooms = await ChatroomSubscriptionModel.findAll({ where: { userId } });
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
      const retrievedChatroom = await ChatroomSubscriptionModel.findOne({ where: { ...chatroomSubscription } });
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
}

export default SequelizeDB;
export { SequelizeDB, DB_Instance };
