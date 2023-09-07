import { ChatroomMessage, ChatroomMessageInput } from "../../../shared/types/Models/ChatroomMessage";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";

interface ChatroomMessageDatabase {
  createChatroomMessage(message: ChatroomMessageInput): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  retrieveAllChatroomMessages(chatroomId: number): Promise<DatabaseActionResultWithReturnValue<Array<ChatroomMessage>>>;
  retrieveChatroomMessage(messageId: number): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  updateChatroomMessage(
    messageId: number,
    messageFieldsToUpdate: Partial<Pick<ChatroomMessage, "content" | "updatedAt">>,
  ): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  deleteChatroomMessage(messageId: number): Promise<DatabaseActionResult>;
}

export default ChatroomMessageDatabase;
