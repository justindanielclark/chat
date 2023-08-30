import { ChatroomAdmin } from "../../../shared/types/Models/ChatroomAdmin";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomAdminDatabase {
  createChatroomAdmin(chatroomAdmin: ChatroomAdmin): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin>>;
  retreiveAllChatroomAdminsByChatroomId(
    chatroomId: number,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin[]>>;
  retreiveAllChatroomAdminsByUserId(userId: number): Promise<DatabaseActionResultWithReturnValue<ChatroomAdmin[]>>;
  deleteChatroomAdmin(chatroomAdmin: ChatroomAdmin): Promise<DatabaseActionResult>;
}

export default ChatroomAdminDatabase;
