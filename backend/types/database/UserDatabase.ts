import User from "../../../shared/types/Models/User";
import DatabaseActionResultWithReturnValue, { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";

interface UserDatabase {
  createUser: (
    user: Omit<User, "id" | "createdAt" | "updatedAt" | "profile" | "currently_online">,
  ) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserById: (id: number) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserByUsername: (username: string) => Promise<DatabaseActionResultWithReturnValue<User>>;
  updateUser: (user: User) => Promise<DatabaseActionResultWithReturnValue<User>>;
  deleteUserById: (id: number) => Promise<DatabaseActionResult>;
  deleteUserByUsername: (username: string) => Promise<DatabaseActionResult>;
}

export default UserDatabase;
