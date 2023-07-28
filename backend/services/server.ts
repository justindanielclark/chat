import app from "./app";
import http from "http";

export class Server {
  private _httpServer: ReturnType<typeof http.createServer>;
  private _port: number;
  constructor(port: number) {
    this._port = port;
    this._httpServer = http.createServer(app);
  }
  public start(callback?: (() => void) | Array<() => void>) {
    if (callback !== undefined) {
      if (Array.isArray(callback)) {
        for (const cb of callback) {
          cb();
        }
      } else {
        callback();
      }
    }
    this._httpServer.listen(this._port);
  }
  public close(callback?: (() => void) | Array<() => void>) {
    if (callback !== undefined) {
      if (Array.isArray(callback)) {
        for (const cb of callback) {
          cb();
        }
      } else {
        callback();
      }
    }
    this._httpServer.close();
  }
  public getServer(): ReturnType<typeof http.createServer> {
    return this._httpServer;
  }
}
