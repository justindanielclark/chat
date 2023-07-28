import express from "express";
import type { Express } from "express";
import http from "http";

export class Server {
  public app: Express;
  private _httpServer: ReturnType<typeof http.createServer>;
  private _port: number;
  constructor(port: number) {
    this.app = express();
    this._port = port;
    this._httpServer = http.createServer(this.app);
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
}
