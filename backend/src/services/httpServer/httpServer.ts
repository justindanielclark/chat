import app from "./app";
import http from "http";

type HTTP_Server_Type = ReturnType<typeof http.createServer>;

class HTTP_Server {
  private static _instance: HTTP_Server_Type;
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
    throw new Error("Do not call initialize after it has already been called once");
  }
  public static getInstance(): HTTP_Server_Type {
    if (HTTP_Server._instance) {
      return HTTP_Server._instance;
    }
    throw new Error("Cannot get an instance if static class is not initialized");
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
    HTTP_Server._instance.listen(HTTP_Server._port);
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
    HTTP_Server._instance.close();
  }
}

export default HTTP_Server;
