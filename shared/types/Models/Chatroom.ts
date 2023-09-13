type Chatroom = {
  id: number; //PK
  ownerId: number; //FK
  name: string;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};
type ChatroomInput = Omit<Chatroom, "id" | "createdAt" | "updatedAt">;

export default Chatroom;

export { Chatroom, ChatroomInput };
