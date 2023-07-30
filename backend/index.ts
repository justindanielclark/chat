//Env Variables
import dotenv from "dotenv";
import getPort from "./src/utils/process_dot_env/getPort";
dotenv.config();
//HTTP Server
import HTTP_Server from "./src/services/httpServer/httpServer";
import serverStartupRoutines from "./src/services/httpServer/startupRoutines";
import serverShutdownRoutines from "./src/services/httpServer/shutdownRoutines";
//Socket Server
import Socket_Server from "./src/services/socketServer/socketServer";

HTTP_Server.initialize(getPort({ portIfProcessEnvUninstantiated: 3000 }));
Socket_Server.initialize(HTTP_Server.getInstance());
HTTP_Server.start(serverStartupRoutines);

const onShutdown = () => {
  HTTP_Server.close(serverShutdownRoutines);
  process.exit(1);
};
process.on("SIGTERM", onShutdown);
process.on("SIGINT", onShutdown);
