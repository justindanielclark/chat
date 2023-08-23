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

class DB_Instance implements UserDatabase {
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
  public async updateUser(userId: number, userInput: UserInput): Promise<DatabaseActionResultWithReturnValue<User>> {
    return {
      success: false,
      failure_id: "1",
    };
  }
}

export default SequelizeDB;
export { SequelizeDB, DB_Instance };
