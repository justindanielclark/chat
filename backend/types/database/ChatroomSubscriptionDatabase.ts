import ChatroomSubscription from "../../../shared/types/Models/ChatroomSubscription";
import DatabaseActionResultWithReturnValue from "./DatabaseActionResultWithReturnValue";

interface ChatroomSubscriptionDatabase {
  createChatroomSubscription: (
    chatroomSubscription: Omit<ChatroomSubscription, "id">,
  ) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  retrieveChatroomSubscriptionById: (id: number) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  updateChatroomSubscription: (
    chatroomSubscription: ChatroomSubscription,
  ) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
  deleteChatroomById: (id: number) => DatabaseActionResultWithReturnValue<ChatroomSubscription>;
}

export default ChatroomSubscriptionDatabase;
