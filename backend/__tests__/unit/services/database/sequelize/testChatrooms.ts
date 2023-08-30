import { Chatroom, ChatroomInput } from "../../../../../../shared/types/Models/Chatroom";

const testChatroomInputs: {
  validChatroom1: ChatroomInput;
  validChatroom2: ChatroomInput;
  validChatroom3: ChatroomInput;
  validChatroom4: ChatroomInput;
  invalidChatroomNonExistingUserId: ChatroomInput;
  invalidChatroomTooShortRoomName: ChatroomInput;
  invalidChatroomTooLongRoomName: ChatroomInput;
} = {
  validChatroom1: {
    name: "Chatroom1",
    ownerId: 1,
    password: null,
  },
  validChatroom2: {
    name: "Chatroom2",
    ownerId: 2,
    password: "somePassword",
  },
  validChatroom3: {
    name: "Chatroom3",
    ownerId: 3,
    password: "somePassword",
  },
  validChatroom4: {
    name: "Chatroom4",
    ownerId: 4,
    password: null,
  },
  invalidChatroomNonExistingUserId: {
    name: "Chatroom3",
    ownerId: 2000000,
    password: null,
  },
  invalidChatroomTooShortRoomName: {
    name: "C",
    ownerId: 2,
    password: null,
  },
  invalidChatroomTooLongRoomName: {
    name: "Chatroom2Chatroom2Chatroom2Chatroom2Chatroom2Chatroom2Chatroom2Chatroom2",
    ownerId: 2,
    password: null,
  },
};

export default testChatroomInputs;
