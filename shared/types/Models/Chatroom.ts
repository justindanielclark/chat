type Chatroom = {
  id: number; //PK
  name: string;
  creator_id: number; //FK: user.id
  last_use: Date;
  creation_date: Date;
};

export default Chatroom;
