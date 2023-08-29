import ChatroomSubscription from "../../../shared/types/Models/ChatroomSubscription";
import DatabaseActionResultWithReturnValue, { DatabaseActionResult } from "./DatabaseActionResultWithReturnValue";

interface ChatroomSubscriptionDatabase {
  createChatroomSubscription: (
    chatroomSubscription: ChatroomSubscription,
  ) => Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription>>;
  retrieveChatroomSubscriptionsByUserId: (
    userId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription[]>>;
  retrieveChatroomSubscriptionsByChatroomId: (
    chatroomId: number,
  ) => Promise<DatabaseActionResultWithReturnValue<ChatroomSubscription[]>>;
  deleteChatroomSubscription: (chatroomSubscription: ChatroomSubscription) => Promise<DatabaseActionResult>;
  verifyChatroomSubscription: (chatroomSubscription: ChatroomSubscription) => Promise<DatabaseActionResult>;
}

export default ChatroomSubscriptionDatabase;
