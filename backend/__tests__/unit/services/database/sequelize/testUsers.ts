import User from "../../../../../../shared/types/Models/User";

const testUsers: {
  validUser: User;
  validUser2: User;
  validUser3: User;
  userWithTooShortUsername: User;
  userWithTooLongUsername: User;
} = {
  validUser: {
    id: 1,
    name: "Test_User",
    password: "ValidPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    is_active: true,
    is_online: true,
  },
  validUser2: {
    id: 2,
    name: "Example_User",
    password: "CoolPassword!2",
    createdAt: new Date(),
    updatedAt: new Date(),
    is_active: true,
    is_online: true,
  },
  validUser3: {
    id: 3,
    name: "Another_valid_user",
    password: "Amazingpass12",
    createdAt: new Date(),
    updatedAt: new Date(),
    is_active: true,
    is_online: true,
  },
  userWithTooShortUsername: {
    id: 1,
    name: "u",
    password: "ValidPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    is_active: true,
    is_online: true,
  },
  userWithTooLongUsername: {
    id: 1,
    name: "alsdfjalksdfjalsfdjlajsfdlajsdflkajsflkjafsldkjklsafjj", //55 chars
    password: "ValidPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    is_active: true,
    is_online: true,
  },
};

export default testUsers;
