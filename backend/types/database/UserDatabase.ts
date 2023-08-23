import { User, UserInput } from "../../../shared/types/Models/User";
import DatabaseActionResultWithReturnValue, { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";

interface UserDatabase {
  createUser: (user: UserInput) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserById: (id: number) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserByName: (name: string) => Promise<DatabaseActionResultWithReturnValue<User>>;
  updateUser: (userId: number, userFieldsToUpdate: Partial<User>) => Promise<DatabaseActionResultWithReturnValue<User>>;
}

export default UserDatabase;
