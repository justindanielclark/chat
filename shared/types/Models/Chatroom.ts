interface Chatroom {
  id: number; //PK
  name: string;
  creator_id: number; //FK: user.id
  createdAt: Date;
  updatedAt: Date;
}

export default Chatroom;
