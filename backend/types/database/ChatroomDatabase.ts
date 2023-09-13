import User from "../../../shared/types/Models/User";
import { Chatroom, ChatroomInput } from "../../../shared/types/Models/Chatroom";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";
import AtLeastOne from "../../../shared/types/Utils/AtLeastOne";
import ChatroomSubscription from "../../../shared/types/Models/ChatroomSubscription";
import ChatroomAdmin from "../../../shared/types/Models/ChatroomAdmin";

interface ChatroomDatabase {
  //! Individual Request
  createChatroom: (chatroom: ChatroomInput) => Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      subscription: ChatroomSubscription;
      admin: ChatroomAdmin;
    }>
  >;
  retrieveChatroomById: (id: number) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  retrieveAllChatrooms: () => Promise<DatabaseActionResultWithReturnValue<Array<Chatroom>>>;
  updateChatroom: (
    id: number,
    chatroomFieldsToUpdate: AtLeastOne<Pick<Chatroom, "name" | "password">>,
  ) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  deleteChatroomById: (id: number) => Promise<DatabaseActionResult>;
  //! Combined Request
  retrieveChatroomWithAllSubscribers: (id: number) => Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      users: Omit<User, "password" | "createdAt" | "updatedAt">[];
    }>
  >;
  retrieveChatroomWithAllBans: (id: number) => Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      users: Omit<User, "password" | "createdAt" | "updatedAt">[];
    }>
  >;
  retrieveChatroomWithAllAdmins: (id: number) => Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      users: Omit<User, "password" | "createdAt" | "updatedAt">[];
    }>
  >;
  retrieveChatroomWithAllUserTypes: (id: number) => Promise<
    DatabaseActionResultWithReturnValue<{
      chatroom: Chatroom;
      subscribers: Omit<User, "password" | "createdAt" | "updatedAt">[];
      bans: Omit<User, "password" | "createdAt" | "updatedAt">[];
      admins: Omit<User, "password" | "createdAt" | "updatedAt">[];
    }>
  >;
}

export default ChatroomDatabase;
