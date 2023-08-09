import {
  Sequelize,
  DataTypes,
  Model,
  where,
  ModelCtor,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import ProcessEnvNotConfiguredError from "../../../utils/errors/ProcessEnvNotConfiguredError";
import {
  DatabaseActionResult,
  DatabaseActionResultWithReturnValue,
} from "../../../../types/database/DatabaseActionResultWithReturnValue";

//Generic Types
import User from "../../../../../shared/types/Models/User";
import Chatroom from "../../../../../shared/types/Models/Chatroom";
import SecurityQuestion from "../../../../../shared/types/Models/SecurityQuestion";

//Input Types
import { UserInput } from "../../../../types/database/sequelize/Inputs/UserInput";
import { ChatroomInput } from "../../../../types/database/sequelize/Inputs/ChatroomInput";

// Table Schemas
import UserSchema from "../../../../types/database/sequelize/Schemas/UserSchema";
import ChatroomSchema from "../../../../types/database/sequelize/Schemas/ChatroomSchema";
import ChatroomSubscriptionSchema from "../../../../types/database/sequelize/Schemas/ChatroomSubscriptionSchema";
import SecurityQuestionSchema from "../../../../types/database/sequelize/Schemas/SecurityQuestionSchema";
import ChatroomMessageScehma from "../../../../types/database/sequelize/Schemas/ChatroomMessagesSchema";

// Table Interfaces
import UserDatabase from "../../../../types/database/UserDatabase";
import ChatroomDatabase from "../../../../types/database/ChatroomDatabase";
import SecurityQuestionDatabase from "../../../../types/database/SecurityQuestionDatabase";

// Errors
import DatabaseNotInitializedError from "../../../utils/errors/DatabaseNotInitializedError";

class SequelizeDbConnection {
  private static _instance: SequelizeDatabase | null;
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
  public static clearInstance(): void {
    if (this._instance) {
      this._instance.close();
    }
    this._instance = null;
  }
}

class SequelizeDatabase implements UserDatabase, ChatroomDatabase, SecurityQuestionDatabase {
  private _sequelize: Sequelize;
  private _isInitialized: boolean;
  public constructor() {
    const db = {
      database: (() => {
        if (process.env.NODE_ENV === "production") {
          if (process.env.MYSQL_DATABASE_NAME) {
            return process.env.MYSQL_DATABASE_NAME;
          }
        } else {
          if (process.env.TEST_MYSQL_DATABASE_NAME) {
            return process.env.TEST_MYSQL_DATABASE_NAME;
          }
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
    await this._sequelize.authenticate();
    await syncAllModels(this._sequelize);
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
    //! Need to add method to query Chatrooms and define out their models to add dynamic ones.
    async function syncAllModels(sequelize: Sequelize): Promise<void> {
      const force = process.env.NODE_ENV !== "production";
      const promises = [];
      for (let model in sequelize.models) {
        promises.push(sequelize.models[model].sync({ force }));
      }
      await Promise.all(promises);
      return;
    }
  }
  public async close(): Promise<void> {
    await this._sequelize.close();
  }
  //UserDatabase
  private userModel(): ModelStatic<Model<User, UserInput>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "userModel()");
    }
    const model = this._sequelize.models["User"];
    if (model) {
      return model;
    }
    throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "userModel()");
  }
  public async createUser(user: UserInput): Promise<DatabaseActionResultWithReturnValue<User>> {
    const userModel = this.userModel();
    try {
      const returnVal = await userModel.create({ ...user });
      return {
        success: true,
        value: returnVal.dataValues,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async retrieveUserById(id: number): Promise<DatabaseActionResultWithReturnValue<User>> {
    const userModel = this.userModel();
    try {
      const foundUser = await userModel.findByPk(id);
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
    const userModel = this.userModel();
    try {
      const foundUser = await userModel.findOne({ where: { username } });
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
  /**
   * Note: Before calling, consumer will need to verify the existance of said user, modify it, and pass it back
   */
  public async updateUser(user: User): Promise<DatabaseActionResultWithReturnValue<User>> {
    const userModel = this.userModel();
    try {
      user.updatedAt = new Date();
      const updatedUser = await userModel.update({ ...user }, { where: { id: user.id } });
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
    const userModel = this.userModel();
    try {
      const result = await userModel.destroy({ where: { id } });
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
    const userModel = this.userModel();
    try {
      const result = await userModel.destroy({ where: { username } });
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
  private chatroomModel(): ModelStatic<Model<Chatroom, ChatroomInput>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "chatroomModel()");
    }
    const model = this._sequelize.models["Chatroom"];
    if (model) {
      return model;
    }
    throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "chatroomModel()");
  }
  public async createChatroom(chatroom: ChatroomInput): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    const chatroomModel = this.chatroomModel();
    try {
      const newChatroom = await chatroomModel.create({ ...chatroom });
      const returnValue = { ...newChatroom.dataValues } as Chatroom;
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
  public async retrieveChatroomById(id: number): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    const chatroomModel = this.chatroomModel();
    try {
      const foundChatroom = await chatroomModel.findByPk(id);
      if (foundChatroom) {
        return {
          success: true,
          value: foundChatroom.dataValues,
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
  /**
   * Note: Before calling, consumer will need to verify the existance of said chatroom, modify it, and pass it back
   */
  public async updateChatroom(chatroom: Chatroom): Promise<DatabaseActionResultWithReturnValue<Chatroom>> {
    const chatroomModel = this.chatroomModel();
    try {
      chatroom.updatedAt = new Date();
      const updatedChatroom = await chatroomModel.update({ ...chatroom }, { where: { id: chatroom.id } });
      return {
        success: true,
        value: { ...chatroom },
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async deleteChatroomById(id: number): Promise<DatabaseActionResult> {
    const chatroomModel = this.chatroomModel();
    try {
      const result = await chatroomModel.destroy({ where: { id } });
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

  // SecurityQuestionDatabase
  private securityQuestionModel(): ModelStatic<Model<SecurityQuestion, SecurityQuestion>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "securityQuestionModel()");
    }
    const model = this._sequelize.models["SecurityQuestion"];
    if (model) {
      return model;
    }
    throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "securityQuestionModel()");
  }
  public async retrieveAllSecurityQuestions(): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion[]>> {
    const securityQuestionModel = this.securityQuestionModel();
    try {
      const questions = await securityQuestionModel.findAll();
      const value = questions.map((question) => question.dataValues);
      return {
        success: true,
        value,
      };
    } catch {
      return {
        success: false,
        error: true,
      };
    }
  }
  public async retrieveSecurityQuestionById(
    id: number,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>> {
    const securityQuestionModel = this.securityQuestionModel();
    try {
      const question = await securityQuestionModel.findByPk(id);
      if (question) {
        return {
          success: true,
          value: question.dataValues,
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

export { SequelizeDatabase, SequelizeDbConnection };
export default SequelizeDbConnection;
