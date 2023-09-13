import { User, UserInput } from "../../../shared/types/Models/User";
import { Chatroom } from "../../../shared/types/Models/Chatroom";
import DatabaseActionResultWithReturnValue, { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";
import AtLeastOne from "../../../shared/types/Utils/AtLeastOne";
import SecurityQuestionAnswer from "../../../shared/types/Models/SecurityQuestionAnswer";
import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";

interface UserDatabase {
  //! Individual Request
  createUser: (
    user: UserInput,
    securityQuestionAnswers: Array<Omit<SecurityQuestionAnswer, "userId">>,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; answers: SecurityQuestionAnswer[] }>>;
  retrieveUserById: (id: number) => Promise<DatabaseActionResultWithReturnValue<User>>;
  retrieveUserByName: (name: string) => Promise<DatabaseActionResultWithReturnValue<User>>;
  updateUser: (
    userId: number,
    userFieldsToUpdate: AtLeastOne<Pick<User, "is_active" | "is_online" | "name" | "password">>,
  ) => Promise<DatabaseActionResultWithReturnValue<User>>;
  //! Combined Requests
  retrieveUserAndAllSubscribedChatrooms: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>>;
  retrieveUserAndAllOwnedChatrooms: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>>;
  retrieveUserAndAllBannedChatrooms: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>>;
  retrieveUserAndAllAdminChatrooms: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; chatrooms: Pick<Chatroom, "name" | "id">[] }>>;
  retrieveUserWithAllChosenSecurityQuestions: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; questions: SecurityQuestion[] }>>;
  retrieveUserWithAllSecurityAnswers: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<{ user: User; answers: SecurityQuestionAnswer[] }>>;
}

export default UserDatabase;
