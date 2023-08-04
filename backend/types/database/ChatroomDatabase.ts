import Chatroom from "../../../shared/types/Models/Chatroom";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomDatabase {
  createChatroom: (chatroom: Omit<Chatroom, "id">) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  retrieveChatroomById: (id: number) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  updateChatroom: (chatroom: Chatroom) => Promise<DatabaseActionResultWithReturnValue<Chatroom>>;
  deleteChatroomById: (id: number) => Promise<DatabaseActionResult>;
}

export default ChatroomDatabase;
