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
import SecurityQuestionAnswer from "../../../../../../shared/types/Models/SecurityQuestionAnswer";
import ChatroomBan from "../../../../../../shared/types/Models/ChatroomBan";
import ChatroomMessage from "../../../../../../shared/types/Models/ChatroomMessage";
import ChatroomAdmin from "../../../../../../shared/types/Models/ChatroomAdmin";
// Test Data
import testUsers from "./testUsers";
import testChatroomInputs from "./testChatrooms";
import testSecurityQuestionAnswers from "./testSecurityAnswers";
// Data
import securityQuestions from "../../../../../src/data/securityQuestions";
// DB Failure Testing
import DatabaseFailureReasons from "../../../../../src/utils/DatabaseFailureReasons/DatabaseFailureReasons";
import { DatabaseActionResult } from "../../../../../types/database/DatabaseActionResultWithReturnValue";

let db: DB_Instance;

beforeAll(async () => {
  db = await SequelizeDB.getInstance();
});

afterAll(() => {
  SequelizeDB.clearInstance();
});

const Users: User[] = [];
const Chatrooms: Chatroom[] = [];
const Questions: SecurityQuestion[] = [];
const Answers: SecurityQuestionAnswer[] = [];
const ChatroomSubscriptions: ChatroomSubscription[] = [];
const ChatroomMessages: ChatroomMessage[] = [];
const ChatroomAdmins: ChatroomAdmin[] = [];
const ChatroomBans: ChatroomBan[] = [];

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
          testSecurityQuestionAnswers[0],
          testSecurityQuestionAnswers[1],
          testSecurityQuestionAnswers[2],
        ]);
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value.user;
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
          const answers = createUserResult.value.answers;
          answers.forEach((answer, idx) => {
            expect(answer.answer).toBe(testSecurityQuestionAnswers[idx].answer);
            expect(answer.securityQuestionId).toBe(testSecurityQuestionAnswers[idx].securityQuestionId);
            expect(answer.userId).toBe(newUser.id);
            Answers.push(answer);
          });
        }
      });
      it("can create a second valid user, and increments the id to 2, Returns: {success: true, value: <User>}", async () => {
        const validUser2 = testUsers.validUser2;
        const createUserResult = await db.createUser({ name: validUser2.name, password: validUser2.password }, [
          testSecurityQuestionAnswers[0],
          testSecurityQuestionAnswers[1],
          testSecurityQuestionAnswers[2],
        ]);
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value.user;
          expect(newUser.id).toBe(2);
          expect(newUser.name).toBe(validUser2.name);
          expect(newUser.password).toBe(validUser2.password);
          Users.push(newUser);
          const answers = createUserResult.value.answers;
          answers.forEach((answer, idx) => {
            expect(answer.answer).toBe(testSecurityQuestionAnswers[idx].answer);
            expect(answer.securityQuestionId).toBe(testSecurityQuestionAnswers[idx].securityQuestionId);
            expect(answer.userId).toBe(newUser.id);
            Answers.push(answer);
          });
        }
      });
      it("can create a third valid user, increments id to 3, returns {success: true, value: <User>}", async () => {
        const validUser3 = testUsers.validUser3;
        const createUserResult = await db.createUser({ name: validUser3.name, password: validUser3.password }, [
          testSecurityQuestionAnswers[0],
          testSecurityQuestionAnswers[1],
          testSecurityQuestionAnswers[2],
        ]);
        expect(createUserResult.success).toBe(true);
        if (createUserResult.success) {
          const newUser = createUserResult.value.user;
          expect(newUser.id).toBe(3);
          expect(newUser.name).toBe(validUser3.name);
          expect(newUser.password).toBe(validUser3.password);
          Users.push(newUser);
          const answers = createUserResult.value.answers;
          answers.forEach((answer, idx) => {
            expect(answer.answer).toBe(testSecurityQuestionAnswers[idx].answer);
            expect(answer.securityQuestionId).toBe(testSecurityQuestionAnswers[idx].securityQuestionId);
            expect(answer.userId).toBe(newUser.id);
            Answers.push(answer);
          });
        }
      });
      it("will refuse to create a user with a username that does not meet regex requirements (too short). Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameInvalid}", async () => {
        const { userWithTooShortUsername } = testUsers;
        const createUserResult = await db.createUser(
          {
            name: userWithTooShortUsername.name,
            password: userWithTooShortUsername.password,
          },
          [testSecurityQuestionAnswers[0], testSecurityQuestionAnswers[1], testSecurityQuestionAnswers[2]],
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
          [testSecurityQuestionAnswers[0], testSecurityQuestionAnswers[1], testSecurityQuestionAnswers[2]],
        );
        expect(createUserResult.success).toBe(false);
        if (!createUserResult.success) {
          expect(createUserResult.failure_id).toBe(DatabaseFailureReasons.UsernameInvalid);
        }
      });
      it("will refuse to create a user with the same name as an existing user. Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameAlreadyExists}", async () => {
        const validUser = Users[0];
        const createUserResult = await db.createUser({ name: validUser.name, password: validUser.password }, [
          testSecurityQuestionAnswers[0],
          testSecurityQuestionAnswers[1],
          testSecurityQuestionAnswers[2],
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
      it("can create a subscription if provided a novel combination of userId/chatroomId", async () => {
        const createdSubscription = await db.createChatroomSubscription({ chatroomId: 1, userId: 2 });
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
        const createdMessage = await db.createChatroomMessage({
          chatroomId: 1,
          userId: 100000,
          deleted: false,
          content,
        });
        expect(createdMessage.success).toBe(false);
        if (!createdMessage.success) {
          expect(createdMessage.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
      it("will refuse to create a chatroomMessage if given an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ForeignKeyConstraintFailure}", async () => {
        const content = "A failed message ;( ;(";
        const createdMessage = await db.createChatroomMessage({
          chatroomId: 100000,
          userId: 1,
          deleted: false,
          content,
        });
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
          ChatroomAdmins.push(createdAdmin.value);
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
        const createdAdmin = await db.createChatroomAdmin({ userId: 1, chatroomId: 1000000 });
        expect(createdAdmin.success).toBe(false);
        if (!createdAdmin.success) {
          expect(createdAdmin.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
    });

    // Chatroom Ban
    describe("createChatroomBan(chatroomBan: Chatroomban)", () => {
      it("can create a new ChatroomBan given novel valid keys", async () => {
        const bannedUser = await db.createChatroomBan({ chatroomId: 1, userId: 3 });
        expect(bannedUser.success).toBe(true);
        if (bannedUser.success) {
          const { chatroomId, userId } = bannedUser.value;
          expect(chatroomId).toBe(1);
          expect(userId).toBe(3);
          ChatroomBans.push(bannedUser.value);
        }
      });
      it("will refuse to create a new ChatroomBan given an invalid chatroomId", async () => {
        const result = await db.createChatroomBan({ chatroomId: 1000, userId: 1 });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
      it("will refuse to create a new Chatroomban given an invalid userId", async () => {
        const result = await db.createChatroomBan({ chatroomId: 1, userId: 1000 });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ForeignKeyConstraintFailure);
        }
      });
    });
  });
  describe("-RETRIEVE", () => {
    //! Request Individual Items
    //Users
    describe("retrieveUserById(id: number)", () => {
      it("can retrieve a user that matches to a valid id, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
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
    describe("retrieveAllChatrooms()", () => {
      it("can retrieve all listed chatrooms and their ids", async () => {
        const retrievedChatrooms = await db.retrieveAllChatrooms();
        expect(retrievedChatrooms.success).toBe(true);
        if (retrievedChatrooms.success) {
          const rooms = retrievedChatrooms.value;
          expect(rooms.length).toBe(Chatrooms.length);
        }
      });
    });
    describe("retrieveChatroomById(id: number)", () => {
      it("can retrieve a chatroom with a valid chatroom id, Returns {success: true, value: <Chatroom>}", async () => {
        const retrieved = await db.retrieveChatroomById(Chatrooms[0].id);
        expect(retrieved.success).toBe(true);
        if (retrieved.success) {
          const newChatroom = retrieved.value;
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
    //Security Question Answers
    describe("retrieveAllSecurityQuestionsAnswersByUserId(userId: number)", () => {
      it("finds and returns all of a users prior answered security questions", async () => {
        const userIdToFind = Users[Math.floor(Math.random() * Users.length)].id;
        const answersToMatch = Answers.filter((answer) => answer.userId === userIdToFind);
        const retrievedAnswers = await db.retrieveAllSecurityQuestionsAnswersByUserId(userIdToFind);
        expect(retrievedAnswers.success).toBe(true);
        if (retrievedAnswers.success) {
          retrievedAnswers.value.forEach((answer) => {
            const matchingAnswer = answersToMatch.find(
              (item) =>
                item.securityQuestionId === answer.securityQuestionId &&
                item.userId === answer.userId &&
                item.answer === answer.answer,
            );
            expect(matchingAnswer).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when supplied an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist}", async () => {
        const retrievedAnswers = await db.retrieveAllSecurityQuestionsAnswersByUserId(10000);
        expect(retrievedAnswers.success).toBe(false);
        if (!retrievedAnswers.success) {
          expect(retrievedAnswers.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    describe("retrieveSecurityQuestionAnswerByIds(userId: number, securityQuestionId: number)", () => {
      it("can retrieve a specific securityQuestionAnswer when given valid inputs, returns {success: true, value: <SecurityQuestionAnswer>}", async () => {
        const randomAnswer = Answers[Math.floor(Math.random() * Answers.length)];
        const retrievedAnswer = await db.retrieveSecurityQuestionAnswerByIds(
          randomAnswer.userId,
          randomAnswer.securityQuestionId,
        );
        expect(retrievedAnswer.success).toBe(true);
        if (retrievedAnswer.success) {
          const { answer, securityQuestionId, userId } = retrievedAnswer.value;
          expect(answer).toBe(randomAnswer.answer);
          expect(securityQuestionId).toBe(randomAnswer.securityQuestionId);
          expect(userId).toBe(randomAnswer.userId);
        }
      });
      it("will fail gracefully to find non-existent SecurityQuestionAnswers when given an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist} ", async () => {
        const retrievedAnswer = await db.retrieveSecurityQuestionAnswerByIds(100000000000, 1);
        expect(retrievedAnswer.success).toBe(false);
        if (!retrievedAnswer.success) {
          expect(retrievedAnswer.failure_id).toBe(DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist);
        }
      });
      it("will fail gracefully to find non-existent SecurityQuestionAnswers when given an invalid securityQuestionId, returns {success: false, failure_id: DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist} ", async () => {
        const retrievedAnswer = await db.retrieveSecurityQuestionAnswerByIds(1, 10000000000);
        expect(retrievedAnswer.success).toBe(false);
        if (!retrievedAnswer.success) {
          expect(retrievedAnswer.failure_id).toBe(DatabaseFailureReasons.SecurityQuestionAnswerDoesNotExist);
        }
      });
    });
    //Chatroom Subscriptions
    describe("retrieveChatroomSubscriptionsByChatroomId(chatroomId:number)", () => {
      // it("test print", async () => {
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   console.log(ChatroomSubscriptions);
      //   console.log("\n\n\n\n\n\n\n\n\n\n");
      //   expect(true).toBe(true);
      // });
      // Current Existing Per Above:
      // [
      //   { chatroomId: 1, userId: 1 },
      //   { chatroomId: 1, userId: 2 },
      //   { chatroomId: 2, userId: 2 },
      //   { chatroomId: 3, userId: 1 }
      // ]
      it("returns all relevant subscriptions to a chosen chatroom in an array if given a valid chatroom id, Returns {success: true, value: ChatroomSubscription[]}", async () => {
        const subscriptionsToChatroom1 = ChatroomSubscriptions.filter((sub) => sub.chatroomId === 1);
        const results = await db.retrieveChatroomSubscriptionsByChatroomId(1);
        expect(results.success).toBe(true);
        if (results.success) {
          const value = results.value;
          value.forEach((v) => {
            expect(
              subscriptionsToChatroom1.find((item) => item.chatroomId === v.chatroomId && item.userId === v.userId),
            ).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when given an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const results = await db.retrieveChatroomSubscriptionsByChatroomId(1000);
        expect(results.success).toBe(false);
        if (!results.success) {
          expect(results.failure_id).toBe(DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist);
        }
      });
    });
    describe("retrieveChatroomSubscriptionsByUserId(userId: number)", () => {
      // CURRENT AT THIS POINT
      // [
      //   { chatroomId: 1, userId: 1 },
      //   { chatroomId: 1, userId: 2 }
      //   { chatroomId: 2, userId: 2 },
      //   { chatroomId: 3, userId: 1 },
      // ]
      it("retrieves all existing chatroom subscriptions when provided a valid userId", async () => {
        const filtered = ChatroomSubscriptions.filter((i) => i.userId === 1);
        const results = await db.retrieveChatroomSubscriptionsByUserId(1);
        expect(results.success).toBe(true);
        if (results.success) {
          const { value } = results;
          value.forEach((i) => {
            expect(filtered.find((j) => i.chatroomId === j.chatroomId && i.userId === j.userId)).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when supplied an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const results = await db.retrieveChatroomSubscriptionsByUserId(1000);
        expect(results.success).toBe(false);
        if (!results.success) {
          expect(results.failure_id).toBe(DatabaseFailureReasons.ChatroomSubscriptionDoesNotExist);
        }
      });
    });
    //Chatroom Admins
    describe("retrieveAllChatroomAdminsByChatroomId(id: number)", () => {
      // Existing at this point:
      // [
      //   { chatroomId: 1, userId: 1 },
      //   { chatroomId: 1, userId: 2 },
      //   { chatroomId: 2, userId: 2 },
      //   { chatroomId: 3, userId: 1 },
      // ]
      it("returns all existing chatroom admins when provided a valid id", async () => {
        const filteredAdmins = ChatroomAdmins.filter((admin) => admin.chatroomId === 1);
        const requestedAdmins = await db.retrieveAllChatroomAdminsByChatroomId(1);
        expect(requestedAdmins.success).toBe(true);
        if (requestedAdmins.success) {
          requestedAdmins.value.forEach((admin) => {
            expect(filteredAdmins.find((item) => item.userId === admin.userId)).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when provided an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const result = await db.retrieveAllChatroomAdminsByChatroomId(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomAdminDoesNotExist);
        }
      });
    });
    describe("retrieveAllChatroomAdminsByUserId(id: number)", () => {
      it("returns all existing chatroom admins when provided a valid id", async () => {
        const filteredAdmins = ChatroomAdmins.filter((admin) => admin.userId === 1);
        const requestedAdmins = await db.retrieveAllChatroomAdminsByUserId(1);
        expect(requestedAdmins.success).toBe(true);
        if (requestedAdmins.success) {
          requestedAdmins.value.forEach((admin) => {
            expect(filteredAdmins.find((item) => item.chatroomId === admin.chatroomId)).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when provided an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist}", async () => {
        const result = await db.retrieveAllChatroomAdminsByUserId(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomAdminDoesNotExist);
        }
      });
    });
    //Chatroom Bans
    describe("retrieveAllChatroomBansByUserId(userId: number)", () => {
      it("can find existing bans for a user, returns {success: true, value: <ChatroomBan[]>}", async () => {
        const filteredBans = ChatroomBans.filter((ban) => ban.userId === 3);
        const requestedBans = await db.retrieveAllChatroomBansByUserId(3);
        expect(requestedBans.success).toBe(true);
        if (requestedBans.success) {
          expect(requestedBans.value.length).toBeGreaterThan(0);
          expect(requestedBans.value.length).toBe(filteredBans.length);
        }
      });
      it("fails gracefully when requesting a userId that doesn't exist, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const requestedBans = await db.retrieveAllChatroomBansByUserId(1000);
        expect(requestedBans.success).toBe(false);
        if (!requestedBans.success) {
          expect(requestedBans.failure_id).toBe(DatabaseFailureReasons.ChatroomBanDoesNotExist);
        }
      });
    });
    describe("retrieveAllChatroomBansByChatroomId(chatroomId: number)", () => {
      it("can find existing bans for a chatroom, returns {success: true, value: <ChatroomBan[]>}", async () => {
        const filteredBans = ChatroomBans.filter((ban) => ban.chatroomId === 1);
        const requestedBans = await db.retrieveAllChatroomBansByChatroomId(1);
        expect(requestedBans.success).toBe(true);
        if (requestedBans.success) {
          expect(requestedBans.value.length).toBeGreaterThan(0);
          expect(requestedBans.value.length).toBe(filteredBans.length);
        }
      });
      it("fails gracefully when requesting a chatroomId that doesn't exist, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const requestedBans = await db.retrieveAllChatroomBansByChatroomId(1000);
        expect(requestedBans.success).toBe(false);
        if (!requestedBans.success) {
          expect(requestedBans.failure_id).toBe(DatabaseFailureReasons.ChatroomBanDoesNotExist);
        }
      });
    });
    //Chatroom Messages
    describe("retrieveAllChatroomMessages(chatroomId: number)", () => {
      /* Existing Messages
      [
        {
          id: 1,
          chatroomId: 1,
          userId: 1,
          deleted: false,
          content: "This is my first message! Isn't that cool!",
          updatedAt: 2023-09-04T22:12:03.559Z,
          createdAt: 2023-09-04T22:12:03.559Z
        },
        {
          id: 2,
          chatroomId: 2,
          userId: 2,
          deleted: false,
          content: 'This is my second message in a different chatroom! This is so cool!',
          updatedAt: 2023-09-04T22:12:03.569Z,
          createdAt: 2023-09-04T22:12:03.569Z
        },
        {
          id: 3,
          chatroomId: 1,
          userId: 1,
          deleted: false,
          content: 'Wow! A Third Message!',
          updatedAt: 2023-09-04T22:12:03.579Z,
          createdAt: 2023-09-04T22:12:03.579Z
        }
      ]
      */
      it("is able to find all chatroom messages if provided a valid chatroom id, returns {success: true, value: ChatroomMessage[]}", async () => {
        const filteredMessages = ChatroomMessages.filter((i) => i.chatroomId === 1);
        const results = await db.retrieveAllChatroomMessages(1);
        expect(results.success).toBe(true);
        if (results.success) {
          const { value } = results;
          expect(value.length).toBe(filteredMessages.length);
          value.forEach((i) => {
            expect(filteredMessages.find((j) => j.chatroomId === i.chatroomId && j.userId === i.userId)).not.toBe(
              undefined,
            );
          });
        }
      });
      it("fails gracefully when provided an invalid chatroomId, returns {success: false, failure_id: DatabaseFailureReasons.ChatroomMessageDoesNotExist}", async () => {
        const result = await db.retrieveAllChatroomMessages(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomMessageDoesNotExist);
        }
      });
    });
    describe("retrieveChatroomMessage(messageID: number)", () => {
      it("is able to return a single chatroom message when provided a valid id", async () => {
        const message = ChatroomMessages.find((i) => i.id === 1);
        const result = await db.retrieveChatroomMessage(1);
        expect(result.success).toBe(true);
        if (result.success) {
          const { value } = result;
          expect(value.chatroomId).toBe(message?.chatroomId);
          expect(value.content).toBe(message?.content);
          expect(value.deleted).toBe(message?.deleted);
          expect(value.userId).toBe(message?.userId);
        }
      });
      it("fails gracefully when provided an invalid chatroom message id", async () => {
        const result = await db.retrieveChatroomMessage(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomMessageDoesNotExist);
        }
      });
    });

    //! Request Joined Items

    //Chatroom With All Users Types
    describe("retrieveChatroomWithAllUserTypes(id: number)", () => {
      it("is able to retrieve a chatroom if given a valid chatroom id, and returns all associated bans/admins/subscribers", async () => {
        const retrievedChatroomId = 1;
        const result = await db.retrieveChatroomWithAllUserTypes(retrievedChatroomId);
        expect(result.success).toBe(true);
        if (result.success) {
          const { chatroom: retrievedChatroom, admins, bans, subscribers } = result.value;
          const memory_subs: User[] = [];
          const memory_admins: User[] = [];
          const memory_bans: User[] = [];
          ChatroomSubscriptions.filter((sub) => sub.chatroomId === retrievedChatroomId).forEach((sub) =>
            memory_subs.push(Users.find((user) => user.id === sub.userId) as User),
          );
          ChatroomAdmins.filter((admins) => admins.chatroomId === retrievedChatroomId).forEach((admin) =>
            memory_admins.push(Users.find((user) => user.id === admin.userId) as User),
          );
          ChatroomBans.filter((ban) => ban.chatroomId === retrievedChatroomId).forEach((ban) =>
            memory_bans.push(Users.find((user) => user.id === ban.userId) as User),
          );
          const chatroom = Chatrooms.find((chatroom) => chatroom.id === retrievedChatroomId) as Chatroom;

          //All Chatroom Qualities Match
          expect(retrievedChatroom.id).toBe(chatroom.id);
          expect(retrievedChatroom.name).toBe(chatroom.name);
          expect(retrievedChatroom.password).toBe(chatroom.password);
          expect(retrievedChatroom.createdAt instanceof Date).toBe(true);
          expect(retrievedChatroom.updatedAt instanceof Date).toBe(true);
          //All Subs Info Matches
          subscribers.forEach((sub) => {
            expect(memory_subs.find((mem_sub) => mem_sub.id === sub.id)).not.toBe(undefined);
          });
          //All Bans Info Matches
          bans.forEach((ban) => {
            expect(memory_bans.find((mem_ban) => mem_ban.id === ban.id)).not.toBe(undefined);
          });
          //All Admins Info Matches
          admins.forEach((admin) => {
            expect(memory_admins.find((mem_admin) => mem_admin.id === admin.id)).not.toBe(undefined);
          });
        }
      });
      it("is not able to return an invalid chatroom id, returns {success: false, failure_id: DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const result = await db.retrieveChatroomWithAllUserTypes(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
    //Chatroom With All Subscribers: Names, Ids
    describe("retrieveChatroomWithAllSubscribedUsers(chatroomId: number)", () => {
      it("is able to retrieve an existing chatroom with a valid id and return an array of all current subscribers", async () => {
        const retreivedChatroomId = 1;
        const result = await db.retrieveChatroomWithAllSubscribers(retreivedChatroomId);
        expect(result.success).toBe(true);
        if (result.success) {
          const { chatroom, users } = result.value;
          const chatroomInfo = Chatrooms.find((room) => (room.id = 1));
          if (chatroomInfo) {
            expect(chatroom.id).toBe(retreivedChatroomId);
            expect(chatroom.name).toBe(chatroomInfo.name);
            expect(chatroom.ownerId).toBe(chatroomInfo.ownerId);
            expect(chatroom.password).toBe(chatroom.password);
            const filteredSubs = ChatroomSubscriptions.filter((sub) => sub.chatroomId === 1);
            users.forEach((user) => {
              expect(filteredSubs.find((sub) => sub.userId === user.id)).not.toBe(undefined);
            });
          }
        }
      });
      it("fails gracefully when provided an invalid/nonexistant chatroomId, returns {success: false, DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const result = await db.retrieveChatroomWithAllSubscribers(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
    //Chatroom with All Banned Users: Names, Ids
    describe("retrieveChatroomWithAllBans(id: number)", () => {
      it("is able to retrieve an existing chatroom with a valid id and return an array of all banned subscribers", async () => {
        const result = await db.retrieveChatroomWithAllBans(1);
        expect(result.success).toBe(true);
        if (result.success) {
          const { chatroom, users } = result.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = chatroom;
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

          const bans = ChatroomBans.filter((bans) => bans.chatroomId === 1);
          bans.forEach((ban) => {
            expect(ban.chatroomId).toBe(1);
            expect(users.find((user) => user.id === ban.userId)).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when provided an invalid/nonexistant chatroomId, return {success: false, DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const result = await db.retrieveChatroomWithAllBans(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
    //Chatroom With All Admins: Names, Ids
    describe("retrieveChatroomWithAllAdmins(id: number", () => {
      it("is able to retrieve an existing chatroom with a valid id and return an array of all admin users", async () => {
        const retrievedChatroomId = 1;
        const result = await db.retrieveChatroomWithAllAdmins(retrievedChatroomId);
        expect(result.success).toBe(true);
        if (result.success) {
          const { chatroom, users } = result.value;
          const { id, createdAt, name, ownerId, password, updatedAt } = chatroom;
          const storedChatroom = Chatrooms.find((room) => (room.id = retrievedChatroomId));
          expect(typeof id).toBe("number");
          expect(id).toBe(storedChatroom?.id);
          expect(typeof ownerId).toBe("number");
          expect(ownerId).toBe(storedChatroom?.ownerId);
          expect(typeof name).toBe("string");
          expect(name).toBe(storedChatroom?.name);
          expect(password).toBe(storedChatroom?.password);
          expect(createdAt instanceof Date).toBe(true);
          expect(updatedAt instanceof Date).toBe(true);

          const admins = ChatroomAdmins.filter((admin) => admin.chatroomId === retrievedChatroomId);
          admins.forEach((admin) => {
            expect(admin.chatroomId).toBe(retrievedChatroomId);
            expect(users.find((user) => user.id === admin.userId)).not.toBe(undefined);
          });
        }
      });
      it("fails gracefully when provided an invalid/nonexistant chatroomId, returns {success: false, DatabaseFailureReasons.ChatroomDoesNotExist}", async () => {
        const result = await db.retrieveChatroomWithAllAdmins(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.ChatroomDoesNotExist);
        }
      });
    });
    //User with All Susbcribed Chatrooms: Names, Ids
    describe("retrieveUserAndAllSubscribedChatrooms(userId: number)", () => {
      it("can return a user and all their associated subs when provided a valid userId", async () => {
        const chosenUserId = 1;
        const result = await db.retrieveUserAndAllSubscribedChatrooms(chosenUserId);
        expect(result.success).toBe(true);
        if (result.success) {
          const filteredSubs = ChatroomSubscriptions.filter((sub) => sub.userId === chosenUserId);
          const user = testUsers.validUser;
          const returnedUser = result.value.user;
          const returnedSubbedRooms = result.value.chatrooms;
          expect(user.name).toBe(returnedUser.name);
          filteredSubs.forEach((sub) => {
            returnedSubbedRooms.find((i) => (i.id = sub.chatroomId));
          });
        }
      });
      it("fails gracefully when provided an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const result = await db.retrieveUserAndAllSubscribedChatrooms(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    //User With All Admin Privledged Chatrooms: Names, Ids
    describe("retrieveUserAndAllAdminChatrooms(userId: number)", () => {
      it("can return a user and all their associated admined rooms when provided a valid userId", async () => {
        const chosenUserId = 1;
        const result = await db.retrieveUserAndAllSubscribedChatrooms(chosenUserId);
        expect(result.success).toBe(true);
        if (result.success) {
          const filteredAdmins = ChatroomAdmins.filter((admin) => admin.userId === chosenUserId);
          const user = testUsers.validUser;
          const returnedUser = result.value.user;
          const returnedRooms = result.value.chatrooms;
          expect(user.name).toBe(returnedUser.name);
          filteredAdmins.forEach((admin) => {
            returnedRooms.find((i) => (i.id = admin.chatroomId));
          });
        }
      });
      it("fails gracefully when provided an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const result = await db.retrieveUserAndAllAdminChatrooms(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    //User With All Banned Chatrooms: Names, Ids
    describe("retrieveUserAndAllBannedChatrooms(userId: number)", () => {
      it("can return a user and all their associated banned rooms when provided a valid userId", async () => {
        const chosenUserId = 1;
        const result = await db.retrieveUserAndAllBannedChatrooms(chosenUserId);
        expect(result.success).toBe(true);
        if (result.success) {
          const filteredBans = ChatroomBans.filter((ban) => ban.userId === chosenUserId);
          const user = testUsers.validUser;
          const returnedUser = result.value.user;
          const returnedRooms = result.value.chatrooms;
          expect(user.name).toBe(returnedUser.name);
          filteredBans.forEach((ban) => {
            returnedRooms.find((i) => (i.id = ban.chatroomId));
          });
        }
      });
      it("fails gracefully when provided an invalid userId, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist", async () => {
        const result = await db.retrieveUserAndAllBannedChatrooms(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    //User With All Chosen Security Questions: Question, Ids
    describe("retrieveUserWithAllChosenSecurityQuestions(userId: number)", () => {
      it("can return a user with all their associated chosen security questions when provided a valid userId", async () => {
        const retrievedUser = 1;
        const result = await db.retrieveUserWithAllChosenSecurityQuestions(retrievedUser);
        expect(result.success).toBe(true);
        if (result.success) {
          const { user, questions } = result.value;
          const matchingUser = Users.find((user) => user.id === retrievedUser) as User;
          questions.forEach((question) => {
            const foundQ = Questions.find((q) => question.id === q.id && question.question === q.question);
            expect(foundQ).not.toBe(undefined);
          });
          expect(user.id).toBe(matchingUser.id);
          expect(user.name).toBe(matchingUser.name);
          expect(user.is_active).toBe(matchingUser.is_active);
          expect(user.is_online).toBe(matchingUser.is_online);
        }
      });
      it("will refuse to retrieve a user with an invalid id, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist}", async () => {
        const result = await db.retrieveUserWithAllChosenSecurityQuestions(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    //User With All Security Answers: Answer, Question Ids
    describe("retrieveUserWithAllSecurityAnswers(userId: number)", () => {
      it("is able to retrieve a user and all their associated security answers", async () => {
        const retrievedUserId = 1;
        const result = await db.retrieveUserWithAllSecurityAnswers(retrievedUserId);
        expect(result.success).toBe(true);
        if (result.success) {
          const ans = Answers.filter((a) => a.userId === retrievedUserId);
          const retrievedUser = Users.find((u) => u.id === retrievedUserId) as User;
          const { user, answers } = result.value;
          answers.forEach((answer) => {
            expect(ans.find((a) => a.answer === answer.answer)).not.toBe(undefined);
          });
          expect(user.id).toBe(retrievedUser.id);
          expect(user.name).toBe(retrievedUser.name);
        }
      });
      it("fails to retrieve a user with an invalid ID, returns {success: false, failure_id: DatabaseFailureReasons.UserDoesNotExist}", async () => {
        const result = await db.retrieveUserWithAllSecurityAnswers(1000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
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
      it("can delete a chatroom when provided a valid id, returns {success: true}, additionally deletes all other made associations", async () => {
        const deletedChatroomId = 1;
        const deleteResult = await db.deleteChatroomById(deletedChatroomId);
        console.log(deleteResult);
        expect(deleteResult.success).toBe(true);
        if (deleteResult.success) {
          const promises: Promise<DatabaseActionResult>[] = [
            db.retrieveAllChatroomAdminsByChatroomId(deletedChatroomId),
            db.retrieveAllChatroomBansByChatroomId(deletedChatroomId),
            db.retrieveChatroomSubscriptionsByChatroomId(deletedChatroomId),
            db.retrieveAllChatroomMessages(deletedChatroomId),
          ];
          const ResovledPromises = await Promise.all(promises);
          expect(ResovledPromises[0].success).toBe(false);
          expect(ResovledPromises[1].success).toBe(false);
          expect(ResovledPromises[2].success).toBe(false);
          expect(ResovledPromises[3].success).toBe(false);
        }
      });
    });
  });
});
