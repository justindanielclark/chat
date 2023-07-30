import http from "http";
import { Server } from "socket.io";
import ClientToServerEvents from "../../shared/types/SocketIO/ClientToServerEvents";
import ServerToClientEvents from "../../shared/types/SocketIO/ServerToClientEvents";
import InterServerEvents from "../../shared/types/SocketIO/InterServerEvents";
import SocketData from "../../shared/types/SocketIO/SocketData";

type Socket_Server_Type = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

class Socket_Server {
  private static _instance: Socket_Server_Type;
  private constructor() {
    //Empty, cannot be initialized if private;
  }
  public static initialize(httpServer: ReturnType<typeof http.createServer>) {
    Socket_Server._instance = new Server(httpServer);
    Socket_Server.setup();
  }
  public static getInstance(): Socket_Server_Type {
    if (!Socket_Server._instance) {
      throw new Error(
        "Socket_Server must be initialized by being provided an HTTP Server in its .initializeMethod before a reference to its instance can be returned",
      );
    }
    return Socket_Server._instance;
  }
  private static setup(): void {
    const io = Socket_Server._instance;
    io.on("connection", (socket) => {});
  }
}

export default Socket_Server;
