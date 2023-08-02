type ChatroomSubscription = {
  id: number; //PK
  chatroom_id: number; //FK
  user_id: number; //FK
};

export default ChatroomSubscription;
