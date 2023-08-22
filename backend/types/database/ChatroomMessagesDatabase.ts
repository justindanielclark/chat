import ChatroomMessage from "../../../shared/types/Models/ChatroomMessage";
import { DatabaseActionResult, DatabaseActionResultWithReturnValue } from "./DatabaseActionResultWithReturnValue";
import { ChatroomMessageInput } from "./sequelize/Inputs/ChatroomMessageInput";

interface ChatroomMessageDatabase {
  createChatroomMessage(message: ChatroomMessageInput): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  retreiveAllChatroomMessages(chatroomID: number): Promise<DatabaseActionResultWithReturnValue<Array<ChatroomMessage>>>;
  retreiveChatroomMessage(messageID: number): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  updateChatroomMessage(message: ChatroomMessage): Promise<DatabaseActionResultWithReturnValue<ChatroomMessage>>;
  deleteChatroomMessage(messageID: number): Promise<DatabaseActionResult>;
}

export default ChatroomMessageDatabase;
