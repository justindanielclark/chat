import connectionParameters from "./connectionParameters";
import { Sequelize } from "sequelize";

//Classes
import Chatroom from "./classes/Chatroom";
import ChatroomAdmin from "./classes/ChatroomAdmin";
import ChatroomBan from "./classes/ChatroomBan";
import ChatroomMessage from "./classes/ChatroomMessage";
import ChatroomSubscription from "./classes/ChatroomSubscription";
import SecurityQuestion from "./classes/SecurityQuestion";
import SecurityQuestionAnswer from "./classes/SecurityQuestionAnswer";
import User from "./classes/User";

class SequelizeDB {
  private static _instance: DB_Instance | null;
  private constructor() {
    //Empty, never intended to be called;
  }
  public static async getInstance(): Promise<DB_Instance> {
    if (!SequelizeDB._instance) {
      SequelizeDB._instance = new DB_Instance();
      await SequelizeDB._instance.initialize();
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

class DB_Instance {
  public async initialize(): Promise<void> {}
  public close(): void {}
}
