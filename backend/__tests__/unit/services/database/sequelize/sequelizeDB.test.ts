//! Required to Load .env for DB connection, must be first
import dotenv from "dotenv";
if (process.env.DOTENV_LOADED !== "true") {
  dotenv.config();
}
//!
import { SequelizeDB, DB_Instance } from "../../../../../src/services/database/sequelize/sequelizeDatabase";
// Models
import User from "../../../../../../shared/types/Models/User";
import Chatroom from "../../../../../../shared/types/Models/Chatroom";
// Test Data
import testUsers from "./testUsers";
import testChatroomInputs from "./testChatrooms";
// DB Failure Testing
import DatabaseFailureReasons from "../../../../../src/utils/DatabaseFailureReasons/DatabaseFailureReasons";
import { create } from "domain";

let db: DB_Instance;

beforeAll(async () => {
  db = await SequelizeDB.getInstance();
});

afterAll(() => {
  SequelizeDB.clearInstance();
});

const Users: User[] = [];
const Chatrooms: Chatroom[] = [];

describe("-SequelizeDB-", () => {
  describe("-User Database Implementation-", () => {
    describe("createUser(user: UserInput)", () => {
      it("can create a valid user and assigns an id of 1, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const validUser = testUsers.validUser;
        const createUserResult = await db.createUser({ name: validUser.name, password: validUser.password });
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value;
          //id
          expect(typeof newUser.id).toBe("number");
          expect(newUser.id).toBe(1);
          //name
          expect(typeof newUser.name).toBe("string");
          expect(newUser.name).toBe(validUser.name);
          //password
          expect(typeof newUser.password).toBe("string");
          expect(newUser.password).toBe(validUser.password);
          //createdAt
          expect(newUser.createdAt instanceof Date).toBe(true);
          //updatedAt
          expect(newUser.updatedAt instanceof Date).toBe(true);
          //is_active
          expect(newUser.is_active).toBe(true);
          //is_online
          expect(newUser.is_online).toBe(true);
          Users.push(newUser);
        }
      });
      it("can create a second valid user, and increments the id to 2, Returns: {success: true, value: <User>}", async () => {
        const validUser2 = testUsers.validUser2;
        const createUserResult = await db.createUser({ name: validUser2.name, password: validUser2.password });
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value;
          expect(newUser.id).toBe(2);
          expect(newUser.name).toBe(validUser2.name);
          expect(newUser.password).toBe(validUser2.password);
          Users.push(newUser);
        }
      });
      it("will refuse to create a user with the same name as an existing user. Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameAlreadyExists}", async () => {
        const validUser = Users[0];
        const createUserResult = await db.createUser({ name: validUser.name, password: validUser.password });
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameAlreadyExists);
        }
      });
      it("will refuse to create a user with a username that does not meet regex requirements (too short). Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const { userWithTooShortUsername } = testUsers;
        const createUserResult = await db.createUser({
          name: userWithTooShortUsername.name,
          password: userWithTooShortUsername.password,
        });
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("will refuse to create a user with a username that does not meet regex requirements (too long). Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const { userWithTooLongUsername } = testUsers;
        const createUserResult = await db.createUser({
          name: userWithTooLongUsername.name,
          password: userWithTooLongUsername.password,
        });
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
    });
    describe("retrieveUserById(id: number)", () => {
      it("can retreive a user that matches to a valid id, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const retrievedUserResult = await db.retrieveUserById(Users[0].id);
        expect(retrievedUserResult.success).toBe(true);
        if (retrievedUserResult.success) {
          const { validUser } = testUsers; // based on insertion in describe block above
          const newUser = retrievedUserResult.value;
          //id
          expect(typeof newUser.id).toBe("number");
          expect(newUser.id).toBe(1);
          //name
          expect(typeof newUser.name).toBe("string");
          expect(newUser.name).toBe(validUser.name);
          //password
          expect(typeof newUser.password).toBe("string");
          expect(newUser.password).toBe(validUser.password);
          //createdAt
          expect(newUser.createdAt instanceof Date).toBe(true);
          //updatedAt
          expect(newUser.updatedAt instanceof Date).toBe(true);
          //is_active
          expect(newUser.is_active).toBe(true);
          //is_online
          expect(newUser.is_online).toBe(true);
        }
      });
      it("will refuse to retrive a user with an invalid id, Returns: {success: false, failure_id: DatabaseFialureReasons.UserDoesNotExist}", async () => {
        const retrievedUserResult = await db.retrieveUserById(10000000);
        expect(retrievedUserResult.success).toBe(false);
        if (!retrievedUserResult.success) {
          expect(retrievedUserResult.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    describe("retrieveUserByUsername(username:string)", () => {
      it("can retrive a created user by their exact matching username, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const retrievedUserResult = await db.retrieveUserByName(Users[0].name); // created earlier in 1st describe block
        expect(retrievedUserResult.success).toBe(true);
        if (retrievedUserResult.success) {
          const retrievedUser = retrievedUserResult.value;
          //id
          expect(typeof retrievedUser.id).toBe("number");
          expect(retrievedUser.id).toBe(1);
          //name
          expect(typeof retrievedUser.name).toBe("string");
          expect(retrievedUser.name).toBe(testUsers.validUser.name);
          //password
          expect(typeof retrievedUser.password).toBe("string");
          expect(retrievedUser.password).toBe(testUsers.validUser.password);
          //createdAt
          expect(retrievedUser.createdAt instanceof Date).toBe(true);
          //updatedAt
          expect(retrievedUser.updatedAt instanceof Date).toBe(true);
          //is_active
          expect(retrievedUser.is_active).toBe(true);
          //is_online
          expect(retrievedUser.is_online).toBe(true);
        }
      });
      it("will refuse to return a user if provided a half matching input, Returns:  {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist}", async () => {
        const retrievedUser = await db.retrieveUserByName(Users[0].name.substring(0, -1)); // Should only be 2 valid users, 1  with name "Test_User"
        expect(retrievedUser.success).toBe(false);
        if (!retrievedUser.success) {
          expect(retrievedUser.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    describe("updateUser(userId: number, userFieldsToUpdate: Partial<User>)", () => {
      it("can update user.name to a new unique field, Returns: {sucess: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const newName = "CoolName_123";
        const updateUserResult = await db.updateUser(Users[0].id, { name: newName });
        expect(updateUserResult.success).toBe(true);
        if (updateUserResult.success) {
          const { validUser } = testUsers;
          const oldName = validUser.name;
          validUser.name = newName; // So it matches in below tests
          const updatedUser = updateUserResult.value;
          //id
          expect(typeof updatedUser.id).toBe("number");
          expect(updatedUser.id).toBe(1);
          //name
          expect(typeof updatedUser.name).toBe("string");
          expect(updatedUser.name).toBe(validUser.name);
          //password
          expect(typeof updatedUser.password).toBe("string");
          expect(updatedUser.password).toBe(validUser.password);
          //createdAt
          expect(updatedUser.createdAt instanceof Date).toBe(true);
          //updatedAt
          expect(updatedUser.updatedAt instanceof Date).toBe(true);
          //is_active
          expect(updatedUser.is_active).toBe(true);
          //is_online
          expect(updatedUser.is_online).toBe(true);

          validUser.name = oldName; // Reset after checks
          await db.updateUser(1, { name: oldName });
          Users[0] = updatedUser;
        }
      });
      it("will refuse to update user.name to a non-unique field, Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameAlreadyExists", async () => {
        const updateUserResult = await db.updateUser(2, { name: testUsers.validUser.name });
        expect(updateUserResult.success).toBe(false);
        if (!updateUserResult.success) {
          expect(updateUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameAlreadyExists);
        }
      });
      it("will refuse to update user.name to a field that does not meet requirements (too short), Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const updateUserResult = await db.updateUser(1, { name: "a" });
        expect(updateUserResult.success).toBe(false);
        if (!updateUserResult.success) {
          expect(updateUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("will refuse to update user.name to a field that does not meet requirements (too long), Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const updateUserResult = await db.updateUser(1, {
          name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        });
        expect(updateUserResult.success).toBe(false);
        if (!updateUserResult.success) {
          expect(updateUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("when updating user.is_active to false, will automatically switch user.is_online to false", async () => {
        //testUsers.validUser (aka id 1) starts out as {is_online: true, is_active: true}
        const updateUserResult = await db.updateUser(Users[0].id, { is_active: false });
        expect(updateUserResult.success).toBe(true);
        if (updateUserResult.success) {
          const updatedUser = updateUserResult.value;
          expect(updatedUser.is_online).toBe(false);
          Users[0] = updateUserResult.value;
        }
      });
    });
  });
  describe("-Chatroom Database Implementation-", () => {
    describe("createChatroom(chatroom: ChatroomInput)", () => {
      it("can create a chatroom with a null password and valid name and existing userId, Returns: {success: true, value: <Chatroom>} where <Chatroom> has all valid expected <Chatroom> properties", async () => {
        const validInput = testChatroomInputs.validChatroom1;
        validInput.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(1);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(testChatroomInputs.validChatroom1.name);
          expect(typeof password).toBe("object");
          expect(password).toBe(null);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms.push(newChatroom);
        }
      });
      it("can create a chatroom with a defined password and a valid name and existing userId, Returns: {success: true, value: <Chatroom>} where <Chatroom> has all valid expected <Chatroom> properties", async () => {
        const validInput = testChatroomInputs.validChatroom2;
        validInput.ownerId = Users[1].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(2);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[1].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(testChatroomInputs.validChatroom2.name);
          expect(typeof password).toBe("string");
          expect(password).toBe(testChatroomInputs.validChatroom2.password);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms.push(newChatroom);
        }
      });
      it("can create a second chatroom associated with the same userId", async () => {
        const validInput = testChatroomInputs.validChatroom3;
        validInput.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(3);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(testChatroomInputs.validChatroom3.name);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms.push(newChatroom);
        }
      });
      it("will refuse to create a otherwise valid chatroom if the userId is invalid", async () => {
        const input = testChatroomInputs.validChatroom4;
        input.ownerId = 10000000;
        const createdChatroom = await db.createChatroom({ ...input });
        expect(createdChatroom.success).toBe(false);
        if (!createdChatroom.success) {
          expect(createdChatroom.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
      it("will refuse to create a chatroom with too short a name, Returns {success: false, failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation", async () => {
        const input = testChatroomInputs.invalidChatroomTooShortRoomName;
        input.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...input });
        expect(createdChatroom.success).toBe(false);
        if (!createdChatroom.success) {
          expect(createdChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameFailsValidation);
        }
      });
      it("will refuse to create a chatroom with too long a name, Returns {success: false, failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation", async () => {
        const input = testChatroomInputs.invalidChatroomTooLongRoomName;
        input.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...input });
        expect(createdChatroom.success).toBe(false);
        if (!createdChatroom.success) {
          expect(createdChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameFailsValidation);
        }
      });
      it("will refuse to create a chatroom with a duplicate name, Returns {sucess: false, failure_id: DatabaseFailureReasons.ChatroomNameAlreadyExists", async () => {
        const validInput = testChatroomInputs.validChatroom1;
        validInput.ownerId = Users[1].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(false);
        if (!createdChatroom.success) {
          expect(createdChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameAlreadyExists);
        }
      });
    });
    //   describe("", () => {});
    //   describe("", () => {});
    //   describe("", () => {});
    //   describe("", () => {});
  });
});
