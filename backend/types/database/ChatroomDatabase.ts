import { Chatroom, ChatroomInput } from "../../../shared/types/Models/Chatroom";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";
import AtLeastOne from "../../../shared/types/Utils/AtLeastOne";
import ChatroomSubscription from "../../../shared/types/Models/ChatroomSubscription";
import ChatroomAdmin from "../../../shared/types/Models/ChatroomAdmin";

interface ChatroomDatabase {
  createChatroom: (
    chatroom: ChatroomInput,
  ) => Promise<DatabaseActionResultWithReturnValue<{ chatroom: Chatroom; subscription: ChatroomSubscription; admin: ChatroomAdmin }>>;
  retrieveChatroomById: (id: number) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  retreiveAllChatrooms: () => Promise<DatabaseActionResultWithReturnValue<Array<Chatroom>>>;
  updateChatroom: (
    id: number,
    chatroomFieldsToUpdate: AtLeastOne<Pick<Chatroom, "name" | "password">>,
  ) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  deleteChatroomById: (id: number) => Promise<DatabaseActionResult>;
}

export default ChatroomDatabase;
