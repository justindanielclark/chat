import { Sequelize, DataTypes, Model, ModelStatic, UniqueConstraintError, ValidationError } from "sequelize";
import ProcessEnvNotConfiguredError from "../../../utils/errors/ProcessEnvNotConfiguredError";
import {
  DatabaseActionResult,
  DatabaseActionResultWithReturnValue,
} from "../../../../types/database/DatabaseActionResultWithReturnValue";

//Generic Types
import User from "../../../../../shared/types/Models/User";
import Chatroom from "../../../../../shared/types/Models/Chatroom";
import SecurityQuestion from "../../../../../shared/types/Models/SecurityQuestion";
import ChatroomMessage from "../../../../../shared/types/Models/ChatroomMessage";

//Input Types
import { UserInput } from "../../../../types/database/sequelize/Inputs/UserInput";
import { ChatroomInput } from "../../../../types/database/sequelize/Inputs/ChatroomInput";
import { ChatroomMessageInput } from "../../../../types/database/sequelize/Inputs/ChatroomMessageInput";

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
import { SecurityQuestionInput } from "../../../../types/database/sequelize/Inputs/SecurityQuestionInput";

//Table Seeds
import securityQuestions from "../../../data/securityQuestions";

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
    const isDev = process.env.NODE_ENV !== "production";
    defineBaseModels(this._sequelize);
    await this._sequelize.authenticate();
    //SYNC MODELS
    const promises = [];
    for (let model in this._sequelize.models) {
      promises.push(this._sequelize.models[model].sync({ force: isDev }));
    }
    await Promise.all(promises);
    this._isInitialized = true;
    //SEED IF NEEDED
    if (isDev) {
      Promise.all(securityQuestions.map((question) => this.createSecurityQuestion(question)));
    }

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
          unique: true,
          validate: {
            // - At least 5 chars long
            // - No longer than 20 chars
            // - starts with an alphabetic character
            // - contains at least 3 alphabetic characters
            is: /^(?=[a-zA-Z])(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z]).{5,20}$/,
          },
        },
        profile: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            // - Contains a capital letter
            // - Contains a lowercase letter
            // - Contains 1 special character from the following: !@#$%^&*()-_=+{[}]|\:;"'<,>.?/
            // - Is At least 5 characters long
            // - Is no longer than 20 characters
            is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\[\]{}|\\:;"'<,>.?/=_+]).{5,20}$/,
          },
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
          unique: true,
          validate: {
            is: /^(?=.*[a-zA-Z]).{5,20}$/,
          },
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
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: 1,
        };
      } else if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: 2,
        };
      }
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 3,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 3,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
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
    } catch (err) {
      if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: 2,
        };
      }
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 3,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 3,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
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
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return {
          success: false,
          failure_id: 5,
        };
      } else if (err instanceof ValidationError) {
        return {
          success: false,
          failure_id: 4,
        };
      }
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 6,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
      };
    }
  }
  public async retreiveAllChatrooms(): Promise<DatabaseActionResultWithReturnValue<Chatroom[]>> {
    const chatroomModel = this.chatroomModel();
    try {
      const chatrooms = await chatroomModel.findAll();
      if (chatrooms) {
        const values = chatrooms.map((room) => room.dataValues);
        return {
          success: true,
          value: values,
        };
      }
      return {
        success: false,
        failure_id: 6,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
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
        failure_id: 0,
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
        failure_id: 6,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
      };
    }
  }

  // SecurityQuestionDatabase
  private securityQuestionModel(): ModelStatic<Model<SecurityQuestion, SecurityQuestionInput>> {
    if (!this._isInitialized) {
      throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "securityQuestionModel()");
    }
    const model = this._sequelize.models["SecurityQuestion"];
    if (model) {
      return model;
    }
    throw new DatabaseNotInitializedError("sequelizeDbConnection.ts", "securityQuestionModel()");
  }
  public async createSecurityQuestion(
    question: SecurityQuestionInput,
  ): Promise<DatabaseActionResultWithReturnValue<SecurityQuestion>> {
    const securityQuestionModel = this.securityQuestionModel();
    try {
      const result = await securityQuestionModel.create(question);
      return {
        success: true,
        value: result.dataValues,
      };
    } catch {
      return { success: false, failure_id: 0 };
    }
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
        failure_id: 0,
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
        failure_id: 7,
      };
    } catch {
      return {
        success: false,
        failure_id: 0,
      };
    }
  }

  // ChatMessageDatabase
}

export { SequelizeDatabase, SequelizeDbConnection };
export default SequelizeDbConnection;
