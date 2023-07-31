import http from "http";
import { Express } from "express";

class ExpressHTTPServer {
  private _server: ReturnType<typeof http.createServer>;
  private _port: number;
  public constructor(port: number, app: Express) {
    this._port = port;
    this._server = http.createServer(app);
  }
  public getServerInstance(): ReturnType<typeof http.createServer> {
    return this._server;
  }
  public getPort(): number {
    return this._port;
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
    this._server.listen(this._port);
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
    this._server.close();
  }
}

export default ExpressHTTPServer;
