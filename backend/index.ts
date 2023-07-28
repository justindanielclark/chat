import express from "express";
import path from "path";
import getPort from "./services/utils/process_dot_env/getPort";
import { Server } from "./services/server";
import defaultRouter from "./routes/default/defaultRouter";
import apiRouter from "./routes/api/apiRouter";

const server = new Server(getPort(3000));
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
const shutdown = () => {
  server.close(serverShutdownRoutines);
  process.exit(1);
};

server.app.use(express.static(path.join(__dirname, "..", "_frontend_build")));
server.app.use("/api", apiRouter);
server.app.use(defaultRouter);

server.start(serverStartupRoutines);

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
