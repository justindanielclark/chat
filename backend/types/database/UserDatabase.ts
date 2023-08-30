import { User, UserInput } from "../../../shared/types/Models/User";
import DatabaseActionResultWithReturnValue, { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";
import AtLeastOne from "../../../shared/types/Utils/AtLeastOne";

interface UserDatabase {
  createUser: (user: UserInput) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserById: (id: number) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserByName: (name: string) => Promise<DatabaseActionResultWithReturnValue<User>>;
  updateUser: (
    userId: number,
    userFieldsToUpdate: AtLeastOne<Pick<User, "is_active" | "is_online" | "name" | "password">>,
  ) => Promise<DatabaseActionResultWithReturnValue<User>>;
}

export default UserDatabase;
