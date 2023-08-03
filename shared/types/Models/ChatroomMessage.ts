interface ChatroomMessage {
  id: number;
  user_id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
export default ChatroomMessage;
