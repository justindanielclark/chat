import ChatroomBan from "../../../shared/types/Models/ChatroomBan";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomBanDatabase {
  createChatroomBan(chatroomBan: ChatroomBan): Promise<DatabaseActionResultWithReturnValue<ChatroomBan>>;
  retrieveAllChatroomBansByChatroomId(chatroomId: number): Promise<DatabaseActionResultWithReturnValue<ChatroomBan[]>>;
  retrieveAllChatroomBansByUserId(userId: number): Promise<DatabaseActionResultWithReturnValue<ChatroomBan[]>>;
  deleteChatroomBan(chatroomBan: ChatroomBan): Promise<DatabaseActionResult>;
}

export default ChatroomBanDatabase;
