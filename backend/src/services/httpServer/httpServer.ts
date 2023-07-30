import app from "./app";
import http from "http";
import FailureToInitializeError from "../../utils/errors/FailureToInitializeError";
import DuplicateInitializationError from "../../utils/errors/DuplicateInitializationError";

type HTTP_Server_Type = ReturnType<typeof http.createServer>;

class HTTP_Server {
  private static _instance: HTTP_Server_Type | undefined;
  private static _port: number;
  private constructor() {
    //Private, so it's never called
  }
  public static initialize(port: number): void {
    if (!HTTP_Server._port) {
      HTTP_Server._port = port;
      HTTP_Server._instance = http.createServer(app);
      return;
    }
    throw new DuplicateInitializationError("In httpServer.ts");
  }
  public static getInstance(): HTTP_Server_Type {
    if (HTTP_Server._instance) {
      return HTTP_Server._instance;
    }
    throw new FailureToInitializeError("In httpServer.ts");
  }
  public static start(callback?: (() => void) | Array<() => void>) {
    if (callback !== undefined) {
      if (Array.isArray(callback)) {
        for (const cb of callback) {
          cb();
        }
      } else {
        callback();
      }
    }
    if (HTTP_Server._instance) HTTP_Server._instance.listen(HTTP_Server._port);
  }
  public static close(callback?: (() => void) | Array<() => void>) {
    if (callback !== undefined) {
      if (Array.isArray(callback)) {
        for (const cb of callback) {
          cb();
        }
      } else {
        callback();
      }
    }
    if (HTTP_Server._instance) HTTP_Server._instance.close();
  }
  public static _testing_only_destroy(): void {
    if (HTTP_Server._instance) {
      if (HTTP_Server._instance.listening) {
        HTTP_Server._instance.close();
      }
      HTTP_Server._instance = undefined;
    }
  }
}

export default HTTP_Server;
