//! REMOVE LATER
import dotenv from "dotenv";
dotenv.config();

import ProcessEnvNotConfiguredError from "../../../utils/errors/ProcessEnvNotConfiguredError";
import {
  Association,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  Model,
  ModelDefined,
  Optional,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
  ForeignKeyConstraintError,
} from "sequelize";

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
const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: "mysql",
});

function setup(sequelize: Sequelize) {
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
  class ChatroomAdmin extends Model<InferAttributes<ChatroomAdmin>, InferCreationAttributes<ChatroomAdmin>> {
    declare userId: number;
    declare chatroomId: number;
    declare user?: NonAttribute<User>;
    declare chatroom?: NonAttribute<Chatroom>;
  }
  class ChatroomSubscription extends Model<
    InferAttributes<ChatroomSubscription>,
    InferCreationAttributes<ChatroomSubscription>
  > {
    // declare userId: ForeignKey<User["id"]>;
    // declare chatroomId: ForeignKey<Chatroom["id"]>;
    declare userId: number;
    declare chatroomId: number;
    declare user?: NonAttribute<User>;
    declare chatroom?: NonAttribute<Chatroom>;
  }
  class ChatroomBan extends Model<InferAttributes<ChatroomBan>, InferCreationAttributes<ChatroomBan>> {
    declare userId: number;
    declare chatroomId: number;
    declare user?: NonAttribute<User>;
    declare chatroom?: NonAttribute<Chatroom>;
  }
  class ChatroomMessage extends Model<InferAttributes<ChatroomMessage>, InferCreationAttributes<ChatroomMessage>> {
    declare id: CreationOptional<number>;
    declare content: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    // declare userId: ForeignKey<User["id"]>;
    // declare chatroomId: ForeignKey<Chatroom["id"]>;
    declare userId: number;
    declare chatroomId: number;

    declare user?: NonAttribute<User>;
    declare chatroom?: NonAttribute<Chatroom>;
  }
  class SecurityQuestion extends Model<InferAttributes<SecurityQuestion>, InferCreationAttributes<SecurityQuestion>> {
    declare id: number;
    declare question: string;
  }
  class SecurityQuestionAnswer extends Model<
    InferAttributes<SecurityQuestionAnswer>,
    InferCreationAttributes<SecurityQuestionAnswer>
  > {
    declare userId: number;
    declare securityQuestionId: number;
    declare answer: string;
    declare user?: NonAttribute<User>;
    declare securityQuestion?: NonAttribute<SecurityQuestion>;
  }

  //Model Initialization
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_online: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, timestamps: true, tableName: "users" },
  );
  Chatroom.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, timestamps: true, tableName: "chatrooms" },
  );
  ChatroomSubscription.init(
    //Composite PK
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      chatroomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Chatroom,
          key: "id",
        },
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "chatroomSubscriptions" },
  );
  ChatroomBan.init(
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      chatroomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Chatroom,
          key: "id",
        },
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "chatroomBans" },
  );
  ChatroomMessage.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      chatroomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Chatroom,
          key: "id",
        },
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, timestamps: true, tableName: "chatroomMessages" },
  );
  ChatroomAdmin.init(
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      chatroomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: Chatroom,
          key: "id",
        },
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "chatroomAdmins" },
  );
  SecurityQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "securityQuestions" },
  );
  SecurityQuestionAnswer.init(
    //Composite PK
    {
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: User,
          key: "id",
        },
        allowNull: false,
      },
      securityQuestionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
          model: SecurityQuestion,
          key: "id",
        },
        allowNull: false,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, timestamps: false, tableName: "securityQuestionAnswers" },
  );
  //Model Associations
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

// (async () => {
//   await sequelize.sync({ force: true });
//   //Create Users 1-3
//   const newUser = await User.create({
//     name: "test_user",
//     password: "test_password",
//   });
//   const newUser2 = await User.create({
//     name: "test_user2",
//     password: "test_password2",
//   });
//   const newUser3 = await User.create({
//     name: "test_user3",
//     password: "test_password3",
//   });
//   //Create Chatroom
//   const newChatroom = await Chatroom.create({
//     name: "test_chatroom",
//     ownerId: newUser.id,
//   });
//   //Have Users Subscribe
//   const newSubscription = await ChatroomSubscription.create({
//     chatroomId: newChatroom.id,
//     userId: newUser.id,
//   });
//   const newSubscription2 = await ChatroomSubscription.create({
//     chatroomId: newChatroom.id,
//     userId: newUser2.id,
//   });
//   const newSubscription3 = await ChatroomSubscription.create({
//     chatroomId: newChatroom.id,
//     userId: newUser3.id,
//   });
//   //Create Some Chat Messages
//   const newChatMessage1 = await ChatroomMessage.create({
//     userId: newUser.id,
//     chatroomId: newChatroom.id,
//     content: "a message",
//   });
//   const newChatMessage2 = await ChatroomMessage.create({
//     userId: newUser.id,
//     chatroomId: newChatroom.id,
//     content: "another message",
//   });
//   const newChatMessage3 = await ChatroomMessage.create({
//     userId: newUser2.id,
//     chatroomId: newChatroom.id,
//     content: "another third message",
//   });

//   const messages = await newChatroom.getChatroomMessages();

//   console.log(messages);

//   await sequelize.close();
// })();
