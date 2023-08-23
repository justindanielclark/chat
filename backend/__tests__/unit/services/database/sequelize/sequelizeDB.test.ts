//! Required to Load .env for DB connection, must be first
import dotenv from "dotenv";
if (process.env.DOTENV_LOADED !== "true") {
  dotenv.config();
}
//!
import { SequelizeDB, DB_Instance } from "../../../../../src/services/database/sequelize/sequelizeDatabase";
import testUsers from "./testUsers";
import DatabaseFailureReasons from "../../../../../src/utils/DatabaseFailureReasons/DatabaseFailureReasons";
let db: DB_Instance;

beforeAll(async () => {
  db = await SequelizeDB.getInstance();
});

afterAll(async () => {
  await SequelizeDB.clearInstance();
});

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
        }
      });
      it("will refuse to create a user with the same name as an existing user. Returns: {success: false, failure_id: DatabaseFailureReasons.UsernameAlreadyExists}", async () => {
        const validUser = testUsers.validUser;
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
        const retrievedUserResult = await db.retrieveUserById(1);
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
        const retrievedUserResult = await db.retrieveUserById(10000000000000000000000000000000000);
        expect(retrievedUserResult.success).toBe(false);
        if (!retrievedUserResult.success) {
          expect(retrievedUserResult.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    describe("retrieveUserByUsername(username:string)", () => {
      it("can retrive a created user by their exact matching username, Returns: {success: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const retrievedUserResult = await db.retrieveUserByName(testUsers.validUser.name); // created earlier in 1st describe block
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
        const retrievedUser = await db.retrieveUserByName("Test_Use"); // Should only be 2 valid users, 1  with name "Test_User"
        expect(retrievedUser.success).toBe(false);
        if (!retrievedUser.success) {
          expect(retrievedUser.failure_id).toBe(DatabaseFailureReasons.UserDoesNotExist);
        }
      });
    });
    describe("updateUser(userId: number, userFieldsToUpdate: Partial<User>)", () => {
      it("can update user.name to a new unique field, Returns: {sucess: true, value: <User>} where <User> has all valid expected <User> properties", async () => {
        const newName = "CoolName_123";
        const updateUserResult = await db.updateUser(1, { name: newName });
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
        const updateUserResult = await db.updateUser(1, { is_active: false });
        expect(updateUserResult.success).toBe(true);
        if (updateUserResult.success) {
          const updatedUser = updateUserResult.value;
          expect(updatedUser.is_online).toBe(false);
        }
      });
    });
  });
});
