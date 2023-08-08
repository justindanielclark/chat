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
const test_user2: User = {
  id: 1,
  username: "test_user_2",
  password: "test_password_2",
  security_answer_1: "test_answer_1_2",
  security_answer_2: "test_answer_2_2",
  security_answer_3: "test_answer_3_2",
  security_question_1_id: 1,
  security_question_2_id: 2,
  security_question_3_id: 3,
  currently_online: true,
  profile: "test_profile_2",
  createdAt: new Date(),
  updatedAt: new Date(),
};
const test_user3: User = {
  id: 1,
  username: "test_user_3",
  password: "test_password_3",
  security_answer_1: "test_answer_1_3",
  security_answer_2: "test_answer_2_3",
  security_answer_3: "test_answer_3_3",
  security_question_1_id: 1,
  security_question_2_id: 2,
  security_question_3_id: 3,
  currently_online: true,
  profile: "test_profile_3",
  createdAt: new Date(),
  updatedAt: new Date(),
};
const test_chatroom: Chatroom = {
  id: 0,
  name: "test_chatroom_1",
  creator_id: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const test_chatroom_2: Chatroom = {
  id: 1,
  name: "test_chatroom_2",
  creator_id: 1,
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
      it("Returns { success.false, error.false } if given a username that does not exist in the database", async () => {
        const result = await instance.retrieveUserByUsername("johnjakeupjingleheimersmith");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(false);
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
      it("Returns {success.false, error.false} if a given user.id does not exist in the database", async () => {
        const result = await instance.retrieveUserById(100000);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(false);
        }
      });
    });
    describe("updateUser()", () => {
      it("takes in a valid user and is able to update it", async () => {
        const changedAnswer = "ChangedAnswer";
        const changedAnswer2 = "ChangedAnswer2";
        const changedAnswer3 = "ChangedAnswer3";
        const changedPassword = "ChangedPassword";
        const retrievedUserResult = await instance.retrieveUserByUsername("test_user");
        let user: User | undefined = undefined;
        if (retrievedUserResult.success) {
          user = retrievedUserResult.value;
        }
        if (user) {
          user.currently_online = false;
          user.security_answer_1 = changedAnswer;
          user.security_answer_2 = changedAnswer2;
          user.security_answer_3 = changedAnswer3;
          user.password = changedPassword;
          const updateResult = await instance.updateUser(user);
          expect(updateResult.success).toBe(true);
          if (updateResult.success) {
            const updatedUser: User = updateResult.value;
            expect(updatedUser.security_answer_1).toBe(changedAnswer);
            expect(updatedUser.security_answer_2).toBe(changedAnswer2);
            expect(updatedUser.security_answer_3).toBe(changedAnswer3);
            expect(updatedUser.password).toBe(changedPassword);
            expect(user.id).toBe(updatedUser.id);
          }
        }
      });
    });
    describe("deleteUserById()", () => {
      it("Is able to take in a user id and delete it", async () => {
        //Create new user
        const { id, createdAt, updatedAt, currently_online, profile, ...userToCreate } = test_user2;
        const returnedNewUser = await instance.createUser(userToCreate);
        expect(returnedNewUser.success).toBe(true);
        if (returnedNewUser.success) {
          const newUser = returnedNewUser.value;
          const returnedDeleteUserResult = await instance.deleteUserById(newUser.id);
          expect(returnedDeleteUserResult.success).toBe(true);
        }
      });
      it("Is able to take in an invalid id and return {success:false, error: false}", async () => {
        const returnedDeletedResult = await instance.deleteUserById(1000);
        expect(returnedDeletedResult.success).toBe(false);
        if (!returnedDeletedResult.success) {
          expect(returnedDeletedResult.error).toBe(false);
        }
      });
    });
    describe("deleteUserByUsername()", () => {
      it("Is able to take an existing username and delete it", async () => {
        const { id, createdAt, updatedAt, currently_online, profile, ...userToCreate } = test_user3;
        const newUserResult = await instance.createUser(userToCreate);
        if (newUserResult.success) {
          const deletedUserResult = await instance.deleteUserByUsername(newUserResult.value.username);
          expect(deletedUserResult.success).toBe(true);
        }
      });
      it("is able to take an non-existant username, (but partial match) and returns {success:false, error:false}", async () => {
        const deleteUserResult = await instance.deleteUserByUsername("test");
        expect(deleteUserResult.success).toBe(false);
        if (!deleteUserResult.success) {
          expect(deleteUserResult.error).toBe(false);
        }
      });
    });
  });
  describe("-Chatroom Database-", () => {
    describe("createChatroom()", () => {
      it("is able to create a new chatrom when provided an appropriate starter chatroom object", async () => {
        const { id: id1, createdAt: createdAt1, updatedAt: updatedAt1, ...newChatroom } = test_chatroom;
        const { id: id2, createdAt: createdAt2, updatedAt: updatedAt2, ...newChatroom2 } = test_chatroom_2;

        const newChatroomReturn = await instance.createChatroom(newChatroom);
        const newChatroomReturn2 = await instance.createChatroom(newChatroom2);
        expect(newChatroomReturn.success).toBe(true);
        if (newChatroomReturn.success) {
          const newChatroom = newChatroomReturn.value;
          expect(newChatroom.createdAt instanceof Date).toBe(true);
          expect(newChatroom.updatedAt instanceof Date).toBe(true);
          expect(typeof newChatroom.id).toBe("Number");
          expect(newChatroom.name).toBe(test_chatroom.name);
          expect(newChatroom.creator_id).toBe(test_chatroom.creator_id);
        }
        if (newChatroomReturn2.success) {
          const newChatroom = newChatroomReturn2.value;
          expect(newChatroom.createdAt instanceof Date).toBe(true);
          expect(newChatroom.updatedAt instanceof Date).toBe(true);
          expect(typeof newChatroom.id).toBe("number");
          expect(newChatroom.name).toBe(test_chatroom_2.name);
          expect(newChatroom.creator_id).toBe(test_chatroom_2.creator_id);
        }
      });
    });
    describe("retrieveChatroomByID()", () => {
      it("is able to return a chatroom when provided a valid id", async () => {
        const chatroomReturn = await instance.retrieveChatroomById(1); //Only works after creation above
        expect(chatroomReturn.success).toBe(true);
        if (chatroomReturn.success) {
          const retreivedChatroom = chatroomReturn.value;
          const newDateValue = new Date().valueOf();
          expect(retreivedChatroom.createdAt.valueOf()).toBeLessThan(newDateValue);
          expect(retreivedChatroom.updatedAt.valueOf()).toBeLessThan(newDateValue);
          expect(retreivedChatroom.creator_id).toEqual(test_chatroom.creator_id);
          expect(retreivedChatroom.name).toEqual(test_chatroom.name);
        }
      });
      it("returns {success:false, error:false} when provided an invalid id", async () => {
        const chatroomReturn = await instance.retrieveChatroomById(100000);
        expect(chatroomReturn.success).toBe(false);
        if (!chatroomReturn.success) {
          expect(chatroomReturn.error).toBe(false);
        }
      });
    });
    describe("updateChatroom", () => {
      it("is able to update a chatroom when provided a complete new chatroom", async () => {
        const retrievedChatroomResult = await instance.retrieveChatroomById(1);
        if (retrievedChatroomResult.success) {
          const retrievedChatroom = retrievedChatroomResult.value;
          const updatedChatroom = { ...retrievedChatroom };
          const updatedChatroomResult = await instance.updateChatroom(updatedChatroom);
          expect(updatedChatroomResult.success).toBe(true);
          if (updatedChatroomResult.success) {
            const updatedChatroom = updatedChatroomResult.value;
            expect(retrievedChatroom.id).toBe(updatedChatroom.id);
            expect(retrievedChatroom.name).toBe(updatedChatroom.name);
            expect(retrievedChatroom.updatedAt.valueOf()).toBeLessThan(updatedChatroom.updatedAt.valueOf());
            expect(retrievedChatroom.createdAt.valueOf()).toEqual(updatedChatroom.createdAt.valueOf());
          }
        }
      });
    });
    // describe("deleteChatroomById", () => {});
  });
});
