import ChatroomMessage from "../../../shared/types/Models/ChatroomMessage";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomMessageDatabase {
  createChatroomMessageTable: (tableName: string) => DatabaseActionResult;
  createChatroomMessage: (
    tableName: string,
    chatroomMessage: Omit<ChatroomMessage, "id" | "createdAt" | "updatedAt">,
  ) => DatabaseActionResultWithReturnValue<ChatroomMessage>;
  retrieveChatroomMessage: (
    tableName: string,
    chatroomMessageId: number,
  ) => DatabaseActionResultWithReturnValue<ChatroomMessage>;
  updateChatroomMessage: (
    tableName: string,
    newChatroomMessage: Omit<ChatroomMessage, "createdAt">,
  ) => DatabaseActionResultWithReturnValue<ChatroomMessage>;
  deleteChatroomMessage: (
    tableName: string,
    message_id: number,
  ) => DatabaseActionResultWithReturnValue<ChatroomMessage>;
}

export default ChatroomMessageDatabase;
