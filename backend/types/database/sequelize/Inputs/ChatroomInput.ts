import Chatroom from "../../../../../shared/types/Models/Chatroom";
import { Optional } from "sequelize";

interface ChatroomInput extends Optional<Chatroom, "id" | "createdAt" | "updatedAt"> {}

export { ChatroomInput };
