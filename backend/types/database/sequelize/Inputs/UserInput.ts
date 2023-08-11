import User from "../../../../../shared/types/Models/User";
import { Optional } from "sequelize";

interface UserInput extends Optional<User, "id" | "currently_online" | "createdAt" | "updatedAt" | "profile"> {}

export { UserInput };
