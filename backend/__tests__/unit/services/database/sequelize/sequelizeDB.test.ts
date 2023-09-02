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
import SecurityQuestion from "../../../../../../shared/types/Models/SecurityQuestion";
import ChatroomSubscription from "../../../../../../shared/types/Models/ChatroomSubscription";
// Test Data
import testUsers from "./testUsers";
import testChatroomInputs from "./testChatrooms";
// Data
import securityQuestions from "../../../../../src/data/securityQuestions";
// DB Failure Testing
import DatabaseFailureReasons from "../../../../../src/utils/DatabaseFailureReasons/DatabaseFailureReasons";
import ChatroomMessage from "../../../../../../shared/types/Models/ChatroomMessage";
import ChatroomAdmin from "../../../../../../shared/types/Models/ChatroomAdmin";

let db: DB_Instance;

beforeAll(async () => {
  db = await SequelizeDB.getInstance();
});

afterAll(() => {
  SequelizeDB.clearInstance();
});

const Questions: SecurityQuestion[] = [];
const Users: User[] = [];
const Chatrooms: Chatroom[] = [];
const ChatroomSubscriptions: ChatroomSubscription[] = [];
const ChatroomMessages: ChatroomMessage[] = [];
const ChatroomAdmins: ChatroomAdmin[] = [];

describe("-SequelizeDB-", () => {
  describe("-CREATE-", () => {
    // Security Questions
    describe("createSecurityQuestion(question: string)", () => {
      it("can create a security question with an incrementing id, Note: this populates the test_tables with all the secuirty questions", async () => {
        for (let i = 0; i < securityQuestions.length; i++) {
          const result = await db.createSecurityQuestion(securityQuestions[i].question);
          expect(result.success).toBe(true);
          if (result.success) {
            Questions.push(result.value);
          }
        }
      });
      it("will refuse to create a repeated security question, returns {success: false, DatabaseFailureReason.SecurityQuestionIsNotUnique}", async () => {
        const result = await db.createSecurityQuestion(Questions[0].question);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.SecurityQuestionIsNotUnique);
        }
      });
    });
    // Users / Security Question Answers
    describe("createUser(user: UserInput)", () => {
      it("can create a valid user and assigns an id of 1, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const validUser = testUsers.validUser;
        const createUserResult = await db.createUser({ name: validUser.name, password: validUser.password }, [
          { securityQuestionId: 1, answer: "A cool answer to a cool question" },
          { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
          { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
        ]);
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
        const createUserResult = await db.createUser({ name: validUser2.name, password: validUser2.password }, [
          { securityQuestionId: 1, answer: "A cool answer to a cool question" },
          { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
          { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
        ]);
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value;
          expect(newUser.id).toBe(2);
          expect(newUser.name).toBe(validUser2.name);
          expect(newUser.password).toBe(validUser2.password);
          Users.push(newUser);
        }
      });
      it("will refuse to create a user with a username that does not meet regex requirements (too short). Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const { userWithTooShortUsername } = testUsers;
        const createUserResult = await db.createUser(
          {
            name: userWithTooShortUsername.name,
            password: userWithTooShortUsername.password,
          },
          [
            { securityQuestionId: 1, answer: "A cool answer to a cool question" },
            { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
            { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
          ],
        );
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("will refuse to create a user with a username that does not meet regex requirements (too long). Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const { userWithTooLongUsername } = testUsers;
        const createUserResult = await db.createUser(
          {
            name: userWithTooLongUsername.name,
            password: userWithTooLongUsername.password,
          },
          [
            { securityQuestionId: 1, answer: "A cool answer to a cool question" },
            { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
            { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
          ],
        );
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("will refuse to create a user with the same name as an existing user. Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameAlreadyExists}", async () => {
        const validUser = Users[0];
        const createUserResult = await db.createUser({ name: validUser.name, password: validUser.password }, [
          { securityQuestionId: 1, answer: "A cool answer to a cool question" },
          { securityQuestionId: 2, answer: "A different cool answer to a different cool question" },
          { securityQuestionId: 3, answer: "The coolest answers to the coolest question" },
        ]);
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameAlreadyExists);
        }
      });
    });
    // Chatrooms
    describe("createChatroom(chatroom: ChatroomInput)", () => {
      it("can create a chatroom with a null password and valid name and existing userId, Returns: {success: true, value: {chatroom: <Chatroom>, subscription: <ChatroomSubscription>, admin: <ChatroomAdmin>}}", async () => {
        const validInput = testChatroomInputs.validChatroom1;
        validInput.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom.chatroom;
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
          const { chatroomId, userId } = newChatroom.subscription;
          expect(chatroomId).toBe(id);
          expect(userId).toBe(ownerId);
          const { userId: u, chatroomId: c } = newChatroom.admin;
          expect(c).toBe(id);
          expect(u).toBe(ownerId);
          ChatroomAdmins.push(newChatroom.admin);
          ChatroomSubscriptions.push(newChatroom.subscription);
          Chatrooms.push(newChatroom.chatroom);
        }
      });
      it("can create a chatroom with a defined password and a valid name and existing userId, {success: true, value: {chatroom: <Chatroom>, subscription: <ChatroomSubscription>}}", async () => {
        const validInput = testChatroomInputs.validChatroom2;
        validInput.ownerId = Users[1].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom.chatroom;
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
          const { chatroomId, userId } = newChatroom.subscription;
          expect(chatroomId).toBe(id);
          expect(userId).toBe(ownerId);
          const { userId: u, chatroomId: c } = newChatroom.admin;
          expect(c).toBe(id);
          expect(u).toBe(ownerId);
          ChatroomAdmins.push(newChatroom.admin);
          ChatroomSubscriptions.push(newChatroom.subscription);
          Chatrooms.push(newChatroom.chatroom);
        }
      });
      it("can create a second chatroom associated with the same userId, returns {success: true, value: {chatroom: <Chatroom>, subscription: <ChatroomSubscription>}}", async () => {
        const validInput = testChatroomInputs.validChatroom3;
        validInput.ownerId = Users[0].id;
        const createdChatroom = await db.createChatroom({ ...validInput });
        expect(createdChatroom.success).toBe(true);
        if (createdChatroom.success) {
          const newChatroom = createdChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = newChatroom.chatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(3);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(testChatroomInputs.validChatroom3.name);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          const { chatroomId, userId } = newChatroom.subscription;
          expect(chatroomId).toBe(id);
          expect(userId).toBe(ownerId);
          const { userId: u, chatroomId: c } = newChatroom.admin;
          expect(c).toBe(id);
          expect(u).toBe(ownerId);
          ChatroomAdmins.push(newChatroom.admin);
          ChatroomSubscriptions.push(newChatroom.subscription);
          Chatrooms.push(newChatroom.chatroom);
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
    // Chatroom Subscription
    describe("createChatroomSubscription(chatroomSusbcription: ChatroomSubscription)", () => {
      // it("test print", async () => {
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   console.log(ChatroomSubscriptions);
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   expect(true).toBe(true);
      // });
      // Current Existing Per Above:
      // [
      //   { chatroomId: 1, userId: 1 },
      //   { chatroomId: 2, userId: 2 },
      //   { chatroomId: 3, userId: 1 }
      // ]
      it("will create a novel combination of userId/chatroomId of existing valid userIds/chatroomIds", async () => {
        const createdSubscription = await db.createChatroomSubscription({ chatroomId: 2, userId: 1 });
        expect(createdSubscription.success).toBe(true);
        if (createdSubscription.success) {
          ChatroomSubscriptions.push(createdSubscription.value);
        }
      });
      it("will refuse to create a non-unique combination of userId/ChatroomId", async () => {
        const createdSubscription = await db.createChatroomSubscription({ chatroomId: 1, userId: 1 });
        expect(createdSubscription.success).toBe(false);
        if (!createdSubscription.success) {
          expect(createdSubscription.failure_id).toBe(DatabaseFailureReasons.ChatroomSubscriptionIsNotUnique);
        }
      });
      it("will refuse to create a subscription with a non-valid userId but valid chatroomId", async () => {
        const createdSubscription = await db.createChatroomSubscription({ chatroomId: 1, userId: 10000 });
        expect(createdSubscription.success).toBe(false);
        if (!createdSubscription.success) {
          expect(createdSubscription.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
    });
    // Chatroom Message
    describe("createChatroomMessage(message: ChatroomMessageInput)", () => {
      it("can create a valid chatroomMessage if given valid foreign keys", async () => {
        const content = "This is my first message! Isn't that cool!";
        const createdMessage = await db.createChatroomMessage({ chatroomId: 1, userId: 1, deleted: false, content });
        expect(createdMessage.success).toBe(true);
        if (createdMessage.success) {
          const { chatroomId, content: c, createdAt, updatedAt, deleted, id, userId } = createdMessage.value;
          expect(typeof id).toBe("number");
          expect(id).toBe(1);
          expect(typeof userId).toBe("number");
          expect(userId).toBe(1);
          expect(typeof chatroomId).toBe("number");
          expect(chatroomId).toBe(1);
          expect(typeof content).toBe("string");
          expect(c).toBe(content);
          expect(typeof deleted).toBe("boolean");
          expect(deleted).toBe(false);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          ChatroomMessages.push(createdMessage.value);
        }
      });
      it("can create a second message with differing user/chatroom information", async () => {
        const content = "This is my second message in a different chatroom! This is so cool!";
        const createdMessage = await db.createChatroomMessage({ chatroomId: 2, userId: 2, deleted: false, content });
        expect(createdMessage.success).toBe(true);
        if (createdMessage.success) {
          const { chatroomId, content: c, createdAt, updatedAt, deleted, id, userId } = createdMessage.value;
          expect(typeof id).toBe("number");
          expect(id).toBe(2);
          expect(typeof userId).toBe("number");
          expect(userId).toBe(2);
          expect(typeof chatroomId).toBe("number");
          expect(chatroomId).toBe(2);
          expect(typeof content).toBe("string");
          expect(c).toBe(content);
          expect(typeof deleted).toBe("boolean");
          expect(deleted).toBe(false);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          ChatroomMessages.push(createdMessage.value);
        }
      });
      it("can create multiple messages under with the same userId and chatroomId", async () => {
        const content = "Wow! A Third Message!";
        const createdMessage = await db.createChatroomMessage({ chatroomId: 1, userId: 1, deleted: false, content });
        expect(createdMessage.success).toBe(true);
        if (createdMessage.success) {
          const { chatroomId, content: c, createdAt, updatedAt, deleted, id, userId } = createdMessage.value;
          expect(typeof id).toBe("number");
          expect(id).toBe(3);
          expect(typeof userId).toBe("number");
          expect(userId).toBe(1);
          expect(typeof chatroomId).toBe("number");
          expect(chatroomId).toBe(1);
          expect(typeof content).toBe("string");
          expect(c).toBe(content);
          expect(typeof deleted).toBe("boolean");
          expect(deleted).toBe(false);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          ChatroomMessages.push(createdMessage.value);
        }
      });
      it("will refuse to create a chatroomMessage if given an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure}", async () => {
        const content = "A failed message ;( ;(";
        const createdMessage = await db.createChatroomMessage({ chatroomId: 1, userId: 100000, deleted: false, content });
        expect(createdMessage.success).toBe(false);
        if (!createdMessage.success) {
          expect(createdMessage.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
      it("will refuse to create a chatroomMessage if given an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure}", async () => {
        const content = "A failed message ;( ;(";
        const createdMessage = await db.createChatroomMessage({ chatroomId: 100000, userId: 1, deleted: false, content });
        expect(createdMessage.success).toBe(false);
        if (!createdMessage.success) {
          expect(createdMessage.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
    });
    // Chatroom Admin
    describe("createChatroomAdmin(chatroomAdmin: ChatroomAdmin)", () => {
      // it("test print", async () => {
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   console.log(ChatroomAdmins);
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   expect(true).toBe(true);
      // });
      // Current Existing Per Above:
      // [
      //   { chatroomId: 1, userId: 1 },
      //   { chatroomId: 2, userId: 2 },
      //   { chatroomId: 3, userId: 1 }
      // ]
      it("can create a new ChatroomAdmin given novel valid foreign keys", async () => {
        const createdAdmin = await db.createChatroomAdmin({ userId: 2, chatroomId: 1 });
        expect(createdAdmin.success).toBe(true);
        if (createdAdmin.success) {
          const { chatroomId, userId } = createdAdmin.value;
          expect(chatroomId).toBe(1);
          expect(userId).toBe(2);
        }
      });
      it("will refuse to create a new ChatroomAdmin given a set of duplicate foreign keys, returns {success: false, failure_id: DatabaseFailureReasons.ChatroomAdminAlreadyExists}", async () => {
        const createdAdmin = await db.createChatroomAdmin({ userId: 2, chatroomId: 1 });
        expect(createdAdmin.success).toBe(false);
        if (!createdAdmin.success) {
          expect(createdAdmin.failure_id).toBe(DatabaseFailureReasons.ChatroomAdminAlreadyExists);
        }
      });
      it("will refuse to create a ChatroomAdmin given an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure}", async () => {
        const createdAdmin = await db.createChatroomAdmin({ userId: 1000000, chatroomId: 1 });
        expect(createdAdmin.success).toBe(false);
        if (!createdAdmin.success) {
          expect(createdAdmin.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
      it("will refuse to create a ChatroomAdmin given an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure}", async () => {
        const createdAdmin = await db.createChatroomAdmin({ userId: 1, chatroomId: 10000000000000 });
        expect(createdAdmin.success).toBe(false);
        if (!createdAdmin.success) {
          expect(createdAdmin.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
    });
  });
  describe("-RETREIVE", () => {
    //Security Questions
    describe("retieveAllSecurityQuestions()", () => {
      it("returns a an array of security questions", async () => {
        const results = await db.retrieveAllSecurityQuestions();
        expect(results.success).toBe(true);
        if (results.success) {
          expect(Array.isArray(results.value)).toBe(true);
          expect(results.value.length).toBe(Questions.length);
        }
      });
    });
    describe("retrieveSecurityQuestionById(id: number)", () => {
      it("returns a question when given a valid id", async () => {
        const result = await db.retrieveSecurityQuestionById(Questions[0].id);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.question).toBe(Questions[0].question);
        }
      });
      it("when given an invalid id will return {success: false, failure_id: DatabaseFailureReasons.SecurityQuestionDoesNotExist}", async () => {
        const result = await db.retrieveSecurityQuestionById(10000000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.SecurityQuestionDoesNotExist);
        }
      });
    });
    //Users
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
    //Chatrooms
    describe("retreiveAllChatrooms()", () => {
      it("can retrieve all listed chatrooms and their ids", async () => {
        const retrievedChatrooms = await db.retreiveAllChatrooms();
        expect(retrievedChatrooms.success).toBe(true);
        if (retrievedChatrooms.success) {
          const rooms = retrievedChatrooms.value;
          expect(rooms.length).toBe(Chatrooms.length);
        }
      });
    });
    describe("retrieveChatroomById(id: number)", () => {
      it("can retrieve a chatroom with a valid chatroom id, Returns {success: true, value: <Chatroom>}", async () => {
        const retreived = await db.retrieveChatroomById(Chatrooms[0].id);
        expect(retreived.success).toBe(true);
        if (retreived.success) {
          const newChatroom = retreived.value;
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
        }
      });
      it("will fail gracefully to return a chatroom when provided in invalid id, Returns {success: false, failure_id: DatabaseFailureReasons.ChatroomDoesNotExist", async () => {
        const retrieved = await db.retrieveChatroomById(10000000);
        expect(retrieved.success).toBe(false);
        if (!retrieved.success) {
          expect(retrieved.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
  });
  describe("-UPDATE-", () => {
    //Users
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
    //Chatrooms
    describe('updateChatroom(id: number, chatroomFieldsToUpdate: AtLeastOne<Chatroom, "name" | "password")', () => {
      it("can update chatroom.name to a new unique field, Returns: {success: true, value: <Chatroom>} where <Chatroom> has all valid expected <Chatroom> properties", async () => {
        const newChatroomName = "a new cool chatroom name";
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { name: newChatroomName });
        expect(updatedChatroom.success).toBe(true);
        if (updatedChatroom.success) {
          const changedChatroom = updatedChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = changedChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(1);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(newChatroomName);
          expect(typeof password).toBe("object");
          expect(password).toBe(null);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms[0] = changedChatroom;
        }
      });
      it("can update chatroom.password to a new value, Returns: {success: true, value: <Chatroom>}", async () => {
        const newPassword = "aCoolPassword";
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { password: newPassword });
        expect(updatedChatroom.success).toBe(true);
        if (updatedChatroom.success) {
          const changedChatroom = updatedChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = changedChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(1);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(Chatrooms[0].name);
          expect(typeof password).toBe("string");
          expect(password).toBe(newPassword);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms[0] = changedChatroom;
        }
      });
      it("can update chatroom.password to a null value, Returns: {success: true, value: <Chatroom>}", async () => {
        const newPassword = null;
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { password: newPassword });
        expect(updatedChatroom.success).toBe(true);
        if (updatedChatroom.success) {
          const changedChatroom = updatedChatroom.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = changedChatroom;
          expect(typeof id).toBe("number");
          expect(id).toBe(1);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(Users[0].id);
          expect(typeof name).toBe("string");
          expect(name).toBe(Chatrooms[0].name);
          expect(typeof password).toBe("object");
          expect(password).toBe(newPassword);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);
          Chatrooms[0] = changedChatroom;
        }
      });
      it("will refuse to update chatroom.name to a non-unique field, Returns: {success: false, failure_id: DatabaseFailureReasons.ChatroomNameAlreadyExists", async () => {
        const newName = Chatrooms[1].name;
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { name: newName });
        expect(updatedChatroom.success).toBe(false);
        if (!updatedChatroom.success) {
          expect(updatedChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameAlreadyExists);
        }
      });
      it("will refuse to create a chatroom with too short a name, Returns {success: false, failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation", async () => {
        const newName = "";
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { name: newName });
        expect(updatedChatroom.success).toBe(false);
        if (!updatedChatroom.success) {
          expect(updatedChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameFailsValidation);
        }
      });
      it("will refuse to create a chatroom with too long a name, Returns {success: false, failure_id: DatabaseFailureReasons.ChatroomNameFailsValidation", async () => {
        const newName =
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const updatedChatroom = await db.updateChatroom(Chatrooms[0].id, { name: newName });
        expect(updatedChatroom.success).toBe(false);
        if (!updatedChatroom.success) {
          expect(updatedChatroom.failure_id).toBe(DatabaseFailureReasons.ChatroomNameFailsValidation);
        }
      });
    });
  });
  describe("-DELETE-", () => {
    //Chatrooms
    describe("deleteChatroomById(id: number)", () => {
      it("can delete a chatroom when provided a valid id, returns {success: true}", async () => {
        const deleteResult = await db.deleteChatroomById(Chatrooms[Chatrooms.length - 1].id);
        expect(deleteResult.success).toBe(true);
        const allChatrooms = await db.retreiveAllChatrooms();
        expect(allChatrooms.success ? allChatrooms.value.length : -1).toBe(Chatrooms.length - 1);
        Chatrooms.pop();
      });
      it("will refuse to delete a chatroom when provided an invalid id, returns {sucess: false, failure_id: DatabaseFailureReasons.ChatroomNotFound}", async () => {
        const deleteResult = await db.deleteChatroomById(100000000000000);
        expect(deleteResult.success).toBe(false);
        if (!deleteResult.success) {
          expect(deleteResult.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
  });
});
