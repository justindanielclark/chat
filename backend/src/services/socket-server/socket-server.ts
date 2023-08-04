import http from "http";
import { Server } from "socket.io";
import ClientToServerEvents from "../../../../shared/types/SocketIO/ClientToServerEvents";
import ServerToClientEvents from "../../../../shared/types/SocketIO/ServerToClientEvents";
import InterServerEvents from "../../../../shared/types/SocketIO/InterServerEvents";
import SocketData from "../../../../shared/types/SocketIO/SocketData";

type Socket_Server_Type = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

class Socket_Server {
  private _instance: Socket_Server_Type;
  public constructor(httpServer: ReturnType<typeof http.createServer>) {
    this._instance = new Server(httpServer);
    this.setup();
  }
  public getInstance(): Socket_Server_Type {
    return this._instance;
  }
  private setup(): void {
    const io = this._instance;
    io.on("connection", (socket) => {});
  }
}

export default Socket_Server;
