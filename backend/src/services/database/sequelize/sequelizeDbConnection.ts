import { Sequelize, DataTypes, Model, where } from "sequelize";
import ProcessEnvNotConfiguredError from "../../../utils/errors/ProcessEnvNotConfiguredError";
import {
  DatabaseActionResult,
  DatabaseActionResultWithReturnValue,
} from "../../../../types/database/DatabaseActionResultWithReturnValue";

//Generic Types
import User from "../../../../../shared/types/Models/User";
import Chatroom from "../../../../../shared/types/Models/Chatroom";

// Table Schemas
import UserSchema from "../../../../types/database/sequelize/Schemas/UserSchema";
import ChatroomSchema from "../../../../types/database/sequelize/Schemas/ChatroomSchema";
import ChatroomSubscriptionSchema from "../../../../types/database/sequelize/Schemas/ChatroomSubscriptionSchema";
import SecurityQuestionSchema from "../../../../types/database/sequelize/Schemas/SecurityQuestionSchema";
import ChatroomMessageScehma from "../../../../types/database/sequelize/Schemas/ChatroomMessagesSchema";

// Table Interfaces
import UserDatabase from "../../../../types/database/UserDatabase";
import ChatroomDatabase from "../../../../types/database/ChatroomDatabase";

// Errors
import DatabaseNotInitializedError from "../../../utils/errors/DatabaseNotInitializedError";

class SequelizeDbConnection {
  private static _instance: SequelizeDatabase;
  private constructor() {
    //Empty, never intended to be called;
  }
  public static async getInstance(): Promise<SequelizeDatabase> {
    if (!SequelizeDbConnection._instance) {
      SequelizeDbConnection._instance = new SequelizeDatabase();
    }
    await SequelizeDbConnection._instance.initialize();
    return SequelizeDbConnection._instance;
  }
}

class SequelizeDatabase implements UserDatabase, ChatroomDatabase {
  private _sequelize: Sequelize;
  private _isInitialized: boolean;
  public constructor() {
    const db = {
      database: (() => {
        if (process.env.MYSQL_DATABASE_NAME) {
          return process.env.MYSQL_DATABASE_NAME;
        }
        throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize database name");
      })(),
      username: (() => {
        if (process.env.MYSQL_USER) {
          return process.env.MYSQL_USER;
        }
        throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize username");
      })(),
      password: (() => {
        if (process.env.MYSQL_PASSWORD) {
          return process.env.MYSQL_PASSWORD;
        }
        throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize password");
      })(),
      host: (() => {
        if (process.env.MYSQL_HOST) {
          return process.env.MYSQL_HOST;
        }
        throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize hostname");
      })(),
      port: (() => {
        if (process.env.MYSQL_PORT) {
          const port = parseInt(process.env.MYSQL_PORT);
          if (!isNaN(port)) {
            return port;
          }
        }
        throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize port");
      })(),
    };
    this._isInitialized = false;
    this._sequelize = new Sequelize(db.database, db.username, db.password, {
      host: db.host,
      port: db.port,
      dialect: "mysql",
    });
  }
  public async initialize(): Promise<void> {
    defineBaseModels(this._sequelize);
    // await syncAllModels(this._sequelize);
    await this._sequelize.authenticate();
    this._isInitialized = true;

    function defineBaseModels(sequelize: Sequelize): void {
      sequelize.define<UserSchema>("User", {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profile: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        currently_online: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        security_question_1_id: {
          //Foreign Key
          type: DataTypes.STRING,
          allowNull: false,
        },
        security_answer_1: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        security_question_2_id: {
          //Foreign Key
          type: DataTypes.STRING,
          allowNull: false,
        },
        security_answer_2: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        security_question_3_id: {
          //Foreign Key
          type: DataTypes.STRING,
          allowNull: false,
        },
        security_answer_3: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      });
      sequelize.define<ChatroomSchema>("Chatroom", {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        creator_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      });
      sequelize.define<SecurityQuestionSchema>(
        "SecurityQuestion",
        {
          id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          question: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        { timestamps: false },
      );
      sequelize.define<ChatroomSubscriptionSchema>(
        "ChatroomSubscription",
        {
          id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          chatroom_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
          },
          user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
          },
        },
        { timestamps: false },
      );
    }
    async function syncAllModels(sequelize: Sequelize): Promise<void> {
      const promises: Array<Promise<Model<any, any>>> = [];
      for (let model in sequelize.models) {
        promises.push(sequelize.models[model].sync());
      }
      await Promise.all(promises);
    }
  }
  public async close(): Promise<void> {
    await this._sequelize.close();
  }
  //UserDatabase
  public async createUser(
    user: Omit<User, "id" | "createdAt" | "updatedAt" | "profile" | "currently_online">,
  ): Promise<DatabaseActionResultWithReturnValue<User>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "createUser()");
    }
    try {
      const newUser = await this._sequelize.models.User.create({ ...user });
      const returnValue = { ...newUser.dataValues } as User;
      return {
        success: true,
        value: returnValue,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async retrieveUserById(id: number): Promise<DatabaseActionResultWithReturnValue<User>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "createUser()");
    }
    try {
      const foundUser = await this._sequelize.models["User"].findOne({ where: { id } });
      if (foundUser) {
        return {
          success: true,
          value: foundUser.dataValues,
        };
      }
      return {
        success: false,
        error: false,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async retrieveUserByUsername(username: string): Promise<DatabaseActionResultWithReturnValue<User>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "createUser()");
    }
    try {
      const foundUser = await this._sequelize.models["User"].findOne({ where: { username } });
      if (foundUser) {
        return {
          success: true,
          value: foundUser.dataValues,
        };
      }
      return {
        success: false,
        error: false,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async updateUser(user: User): Promise<DatabaseActionResultWithReturnValue<User>> {
    try {
      const updatedUser = await this._sequelize.models["User"].update({ ...user }, { where: { id: user.id } });
      return {
        success: true,
        value: { ...user },
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async deleteUserById(id: number): Promise<DatabaseActionResult> {
    try {
      const result = await this._sequelize.models["User"].destroy({ where: { id } });
      if (result === 1) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: false,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async deleteUserByUsername(username: string): Promise<DatabaseActionResult> {
    try {
      const result = await this._sequelize.models["User"].destroy({ where: { username } });
      if (result === 1) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: false,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }

  //ChatroomDatabase
  public async createChatroom() {}
  //! Incomplete - To Finish later
  public async createNewChatroomMessagesTable(tableName: string): Promise<void> {
    const newTable = this._sequelize.define<ChatroomMessageScehma>(
      tableName,
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        timestamps: true,
      },
    );
    await newTable.sync();
    //! CREATE NEW TABLE IN CHATROOMS USING METHOD IN HERE
  }
}

export default SequelizeDbConnection;
