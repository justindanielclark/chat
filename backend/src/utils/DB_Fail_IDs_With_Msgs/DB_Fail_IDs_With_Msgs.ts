import RequestForInvalidDBFailureIDError from "../errors/RequestForInvalidDBFailureID";

const IDs_Msgs: Array<[number, string]> = [
  [0, "Unknown Database Error"],
  //USERNAMES
  [1, "Username already exists. Usernames must be unique."],
  [2, "Username or password does not meet validation constraints"],
  [3, "User Not Found."],
  //CHATROOMS
  [4, "Chatroom name does not meet validation constraints"],
  [5, "Chatroom already exists. Chatroom name must be unique."],
  [6, "Chatroom not found."],
  //SECURITY QUESTION
  [7, "Security Question not found."],
  //CHATROOM MESSAGES
  [8, "Chatroom Message not found."],
  [9, "Chatroom Message does not meet validation constraints"],
];

export default class DB_Fail_IDs_With_Msgs {
  private static _failure_IDs: Map<number, string>;
  private constructor() {}
  private static initialize(): void {
    DB_Fail_IDs_With_Msgs._failure_IDs = new Map<number, string>(IDs_Msgs);
  }
  public static get(id: number) {
    if (!DB_Fail_IDs_With_Msgs._failure_IDs) {
      DB_Fail_IDs_With_Msgs.initialize();
    }

    const result = DB_Fail_IDs_With_Msgs._failure_IDs.get(id);
    if (result) {
      return result;
    } else {
      throw new RequestForInvalidDBFailureIDError("DB_Fail_IDs_With_Msgs.ts", "get(id: number)");
    }
  }
}

export { IDs_Msgs, DB_Fail_IDs_With_Msgs };
