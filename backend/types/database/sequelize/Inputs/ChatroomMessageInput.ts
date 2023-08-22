import ChatroomMessage from "../../../../../shared/types/Models/ChatroomMessage";
import { Optional } from "sequelize";

interface ChatroomMessageInput extends Optional<ChatroomMessage, "id" | "createdAt" | "updatedAt"> {}

export { ChatroomMessageInput };
