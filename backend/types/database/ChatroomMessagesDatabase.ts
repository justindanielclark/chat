import { ChatroomMessage, ChatroomMessageInput } from "../../../shared/types/Models/ChatroomMessage";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomMessageDatabase {
  createChatroomMessage(message: ChatroomMessageInput): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  retreiveAllChatroomMessages(chatroomId: number): Promise<DatabaseActionResultWithReturnValue<Array<ChatroomMessage>>>;
  retreiveChatroomMessage(messageId: number): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  updateChatroomMessage(
    messageId: number,
    messageFieldsToUpdate: Partial<Pick<ChatroomMessage, "content" | "updatedAt">>,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  deleteChatroomMessage(messageId: number): Promise<DatabaseActionResult>;
}

export default ChatroomMessageDatabase;
