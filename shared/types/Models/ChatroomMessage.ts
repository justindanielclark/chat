interface ChatroomMessage {
  id: number;
  userId: number;
  chatroomId: number;
  content: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ChatroomMessageInput = Omit<
  ChatroomMessage,
  "id" | "createdAt" | "updatedAt"
>;

export { ChatroomMessage, ChatroomMessageInput };
export default ChatroomMessage;
