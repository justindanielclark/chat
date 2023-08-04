//Env Variables
import dotenv from "dotenv";
import getPort from "./src/utils/process_dot_env/getPort";
dotenv.config();
//Express App
import MainApp from "./src/services/express-app/app";
//HTTP Server
import ExpressHTTPServer from "./src/services/express-http-server/express-http-server";
import ExpressHttpServerCollection from "./src/services/express-http-server/express-http-server-collection";
//Main Server Routines
import serverStartupRoutines from "./src/services/express-http-server/startupRoutines";
import serverShutdownRoutines from "./src/services/express-http-server/shutdownRoutines";

//Socket Server
// import Socket_Server from "./src/services/socketServer/socketServer";

ExpressHttpServerCollection.createServer("main", getPort({ portIfProcessEnvUninstantiated: 3000 }), MainApp);
const expressServer = ExpressHttpServerCollection.getServer("main") as ExpressHTTPServer;
expressServer.start(serverStartupRoutines);

const onShutdown = () => {
  expressServer.close(serverShutdownRoutines);
  process.exit(1);
};
process.on("SIGTERM", onShutdown);
process.on("SIGINT", onShutdown);
