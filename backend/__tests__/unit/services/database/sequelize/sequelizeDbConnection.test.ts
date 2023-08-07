import dotenv from "dotenv";
import {
  SequelizeDatabase,
  SequelizeDbConnection,
} from "../../../../../src/services/database/sequelize/sequelizeDbConnection";
import User from "../../../../../../shared/types/Models/User";
import Chatroom from "../../../../../../shared/types/Models/Chatroom";
import ChatroomSubscription from "../../../../../../shared/types/Models/ChatroomSubscription";
import ChatroomMessage from "../../../../../../shared/types/Models/ChatroomMessage";
import SecurityQuestion from "../../../../../../shared/types/Models/SecurityQuestion";

dotenv.config();

let instance: SequelizeDatabase;

beforeAll(async () => {
  instance = await SequelizeDbConnection.getInstance();
});

afterAll(() => {
  SequelizeDbConnection.clearInstance();
});

const test_user: User = {
  id: 0,
  username: "test_user",
  password: "test_password",
  security_answer_1: "test_answer_1",
  security_answer_2: "test_answer_2",
  security_answer_3: "test_answer_3",
  security_question_1_id: 1,
  security_question_2_id: 2,
  security_question_3_id: 3,
  currently_online: true,
  profile: "test_profile",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("sequelizeDBConnection", () => {
  describe("-User Database-", () => {
    describe("createUser()", () => {
      it("Takes in a User Object (less createdAt,updatedAt, id, profile) and returns a full User", async () => {
        const { createdAt, currently_online, id, updatedAt, profile, ...userToAdd } = test_user;
        const result = await instance.createUser(userToAdd);
        expect(result.success).toBe(true);
        if (result.success) {
          const newuser = result.value;
          expect(newuser.id).toBeGreaterThan(0);
          expect(newuser.createdAt instanceof Date).toBe(true);
          expect(newuser.updatedAt instanceof Date).toBe(true);
          expect(newuser.username).toBe("test_user");
          expect(newuser.password).toBe("test_password");
        }
      });
      it("Returns {success.false, error.true} if given an incomplete User Object", async () => {
        const { createdAt, currently_online, id, updatedAt, profile, username, ...userToAdd } = test_user;
        const result = await instance.createUser(userToAdd as User);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(true);
        }
      });
      //TODO Test Case with mocked seqeulize.define(). Model calls for create/delete etc need to be mocked to throw exceptions
    });
    describe("retreiveUserByUsername()", () => {
      it("Takes in a username and returns a full user", async () => {
        const result = await instance.retrieveUserByUsername(test_user.username);
        expect(result.success).toBe(true);
        if (result.success) {
          const newuser = result.value;
          expect(newuser.id).toBeGreaterThan(0);
          expect(newuser.createdAt instanceof Date).toBe(true);
          expect(newuser.updatedAt instanceof Date).toBe(true);
          expect(newuser.username).toBe("test_user");
          expect(newuser.password).toBe("test_password");
        }
      });
      it("Returns { success.false, error.true } if given a username that does not exist in the database", async () => {
        const result = await instance.retrieveUserByUsername("johnjakeupjingleheimersmith");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(true);
        }
      });
    });
    describe("retrieveUserById()", () => {
      it("Takes in a valid user id and returns a full user", async () => {
        const result = await instance.retrieveUserById(1);
        expect(result.success).toBe(true);
        if (result.success) {
          const newuser = result.value;
          expect(newuser.id).toBeGreaterThan(0);
          expect(newuser.createdAt instanceof Date).toBe(true);
          expect(newuser.updatedAt instanceof Date).toBe(true);
          expect(newuser.username).toBe("test_user");
          expect(newuser.password).toBe("test_password");
        }
      });
      it("Returns {sucess.false} if a given user.id does not exist in the database", async () => {
        const result = await instance.retrieveUserById(10);
        expect(result.success).toBe(false);
      });
    });
  });
});
