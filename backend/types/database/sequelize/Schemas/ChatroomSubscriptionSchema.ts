import { Model, CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import ChatroomSubscription from "../../../../../shared/types/Models/ChatroomSubscription";

interface ChatroomSubscriptionSchema
  extends ChatroomSubscription,
    Model<InferAttributes<ChatroomSubscriptionSchema>, InferCreationAttributes<ChatroomSubscriptionSchema>> {
  id: CreationOptional<number>;
  chatroom_id: number;
  user_id: number;
}

export default ChatroomSubscriptionSchema;
