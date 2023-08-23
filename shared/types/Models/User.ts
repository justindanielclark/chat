interface User {
  id: number; //PK
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  is_active: boolean;
  is_online: boolean;
}
type UserInput = Pick<User, "name" | "password">;

export default User;
export { User, UserInput };
