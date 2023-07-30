import dotenv from "dotenv";
import getPort from "./services/utils/process_dot_env/getPort";
import HTTP_Server from "./services/httpServer";
import Socket_Server from "./services/socketServer";
dotenv.config();

HTTP_Server.initialize(getPort({ portIfProcessEnvUninstantiated: 3000 }));
Socket_Server.initialize(HTTP_Server.getInstance());

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
  HTTP_Server.close(serverShutdownRoutines);
  process.exit(1);
};

HTTP_Server.start(serverStartupRoutines);

process.on("SIGTERM", shutdownRoutine);
process.on("SIGINT", shutdownRoutine);
