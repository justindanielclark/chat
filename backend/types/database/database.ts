import User from "../../../shared/types/Models/User";
import Chatroom from "../../../shared/types/Models/Chatroom";
import ChatroomSubscription from "../../../shared/types/Models/ChatroomSubscription";
import SecurityQuestion from "../../../shared/types/Models/SecurityQuestion";

interface Database {
  //! To implement
}

interface DatabaseActionResult {
  success: boolean;
}

type DatabaseActionResultWithReturnValue<T> =
  | {
      success: true;
      return: T;
    }
  | {
      success: false;
    };

interface UserDatabase {
  createUser: (user: Omit<User, "id">) => DatabaseActionResultWithReturnValue<User>;
  retrieveUserById: (id: number) => DatabaseActionResultWithReturnValue<User>;
  retrieveUserByUsername: (username: string) => DatabaseActionResultWithReturnValue<User>;
  updateUser: (user: User) => DatabaseActionResultWithReturnValue<User>;
  deleteUserById: (id: number) => DatabaseActionResultWithReturnValue<User>;
  deleteUserByUserNname: (username: string) => DatabaseActionResultWithReturnValue<User>;
}

interface ChatroomDatabase {
  createChatroom: (chatroom: Omit<Chatroom, "id">) => DatabaseActionResultWithReturnValue<Chatroom>;
  retrieveChatroomById: (id: number) => DatabaseActionResultWithReturnValue<Chatroom>;
  updateChatroom: (chatroom: Chatroom) => DatabaseActionResultWithReturnValue<Chatroom>;
  deleteChatroomById: (id: number) => DatabaseActionResultWithReturnValue<Chatroom>;
}

interface ChatroomSubscriptionDatabase {
  createChatroomSubscription: (
    chatroomSubscription: Omit<ChatroomSubscription, "id">,
  ) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  retrieveChatroomSubscriptionById: (id: number) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  updateChatroomSubscription: (
    chatroomSubscription: ChatroomSubscription,
  ) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  deleteChatroomById: (id: number) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
}

interface SecurityQuestionDatabase {
  retrieveSecurityQuestionById: (id: number) => DatabaseActionResultWithReturnValue<SecurityQuestion>;
}
