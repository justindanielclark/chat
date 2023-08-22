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

class User extends Model<
  InferAttributes<User, { omit: "chatrooms" }>,
  InferCreationAttributes<User, { omit: "chatrooms" }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare is_active: CreationOptional<boolean>;
  declare is_online: CreationOptional<boolean>;

  declare getChatrooms: HasManyGetAssociationsMixin<Chatroom>; // Note the null assertions!
  declare addChatroom: HasManyAddAssociationMixin<Chatroom, number>;
  declare addChatrooms: HasManyAddAssociationsMixin<Chatroom, number>;
  declare setChatrooms: HasManySetAssociationsMixin<Chatroom, number>;
  declare removeChatroom: HasManyRemoveAssociationMixin<Chatroom, number>;
  declare removeChatrooms: HasManyRemoveAssociationsMixin<Chatroom, number>;
  declare hasChatroom: HasManyHasAssociationMixin<Chatroom, number>;
  declare hasChatrooms: HasManyHasAssociationsMixin<Chatroom, number>;
  declare countChatrooms: HasManyCountAssociationsMixin;
  declare createChatroom: HasManyCreateAssociationMixin<Chatroom, "ownerId">;
  declare getChatroomSubscriptions: HasManyGetAssociationsMixin<ChatroomSubscription>;

  declare chatrooms?: NonAttribute<Chatroom[]>;

  declare static associations: {
    chatrooms: Association<User, Chatroom>;
    chatroomSubscriptions: Association<User, ChatroomSubscription>;
  };
}
class Chatroom extends Model<InferAttributes<Chatroom>, InferCreationAttributes<Chatroom>> {
  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<User["id"]>;
  declare name: string;
  declare password: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare owner?: NonAttribute<User>;

  declare static associations: {
    chatroomSubscriptions: Association<Chatroom, ChatroomSubscription>;
  };
}
class ChatroomSubscription extends Model<
  InferAttributes<ChatroomSubscription>,
  InferCreationAttributes<ChatroomSubscription>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare chatroomId: ForeignKey<Chatroom["id"]>;

  declare user?: NonAttribute<User>;
  declare chatroom?: NonAttribute<Chatroom>;
}

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
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  { sequelize, timestamps: false, tableName: "chatroomSubscriptions" },
);

User.hasMany(Chatroom, {
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "chatrooms",
});
User.hasMany(ChatroomSubscription, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "chatroomSubscriptions",
});
Chatroom.hasMany(ChatroomSubscription, {
  sourceKey: "id",
  foreignKey: "chatroomId",
  as: "chatroomSubscriptions",
});

(async () => {
  await sequelize.sync({ force: true });
  const newUser = await User.create({
    name: "test_user",
    password: "test_password",
  });
  const newUser2 = await User.create({
    name: "test_user2",
    password: "test_password2",
  });
  const newChatroom = await newUser.createChatroom({
    name: "cool_chatroom_1",
  });
  const newChatroom2 = await newUser.createChatroom({
    name: "cool_chatroom_2",
  });
  const newChatroom3 = await newUser.createChatroom({
    name: "cool_chatroom_3",
  });

  const chatroomSub = await ChatroomSubscription.create({
    chatroomId: newChatroom.id,
    userId: newUser.id,
  });
  console.log(await newUser.getChatroomSubscriptions());
  //WILL THROW ERROR as ownerID is invalid
  try {
    const newChatroom4 = await Chatroom.create({
      name: "a fun chatroom",
      ownerId: 1203,
    });
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
    }
  }

  await sequelize.close();
})();
