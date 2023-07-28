import dotenv from "dotenv";
import getPort from "./services/utils/process_dot_env/getPort";
import { Server } from "./services/server";
import { Server as SocketServer } from "socket.io";
dotenv.config();

const server = new Server(getPort({ portIfProcessEnvUninstantiated: 3000 }));
const serverStartupRoutines = [
  () => {
    console.log("Server Starting...");
  },
];
const serverShutdownRoutines = [
  () => {
    console.log("Server is shutting down...");
  },
];
const shutdownRoutine = () => {
  server.close(serverShutdownRoutines);
  process.exit(1);
};

const io = new SocketServer(server.getServer());

io.on("connection", (socket) => {
  console.log("a user connected (server side)...");
  socket.on("message", (data) => {
    const packet = JSON.parse(data);
    console.log(packet);
  });
  socket.emit("userConnected", "a user connected (client received)...");
  socket.on("disconnect", (socket) => {
    console.log("a user disconnected...");
    io.emit("userDisconnected", "a user disconnected (client received)...");
  });
});

server.start(serverStartupRoutines);

process.on("SIGTERM", shutdownRoutine);
process.on("SIGINT", shutdownRoutine);
