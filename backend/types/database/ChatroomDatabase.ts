import { Chatroom, ChatroomInput } from "../../../shared/types/Models/Chatroom";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomDatabase {
  createChatroom: (chatroom: ChatroomInput) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  retrieveChatroomById: (id: number) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  retreiveAllChatrooms: () => Promise<DatabaseActionResultWithReturnValue<Array<Chatroom>>>;
  updateChatroom: (
    id: number,
    chatroomFieldsToUpdate: Partial<Pick<Chatroom, "name" | "password">>,
  ) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  deleteChatroomById: (id: number) => Promise<DatabaseActionResult>;
}

export default ChatroomDatabase;
