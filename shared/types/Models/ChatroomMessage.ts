interface ChatroomMessage {
  id: number;
  user_id: number;
  chatroom_id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
export default ChatroomMessage;
