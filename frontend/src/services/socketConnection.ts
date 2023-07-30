import io, { Socket } from "socket.io-client";
import ServerToClientEvents from "../../../shared/types/SocketIO/ServerToClientEvents";
import ClientToServerEvents from "../../../shared/types/SocketIO/ClientToServerEvents";

export default class SocketConnection {
  private static _instance: Socket<ServerToClientEvents, ClientToServerEvents>;
  private constructor() {
    // Prevents Direct Instantiation
  }
  public static getInstance(): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > {
    if (!SocketConnection._instance) {
      SocketConnection._instance = io("ws://localhost:3000");
    }
    return SocketConnection._instance;
  }
}
