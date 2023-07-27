import express, { Express, RequestHandler } from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "_frontend_build")));

app.get("/api/*", (req, res) => {
  res.status(200).send("nice!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "_frontend_build", "index.html"));
});

server.listen(port, () => {
  console.log(`[server]: Server is up and running at http://localhost:${port}`);
});

class Server {
  private _expressApp: Express;
  private _httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;
  private _port: number;

  constructor(port: number) {
    this._port = port;
    this._expressApp = express();
    this._httpServer = http.createServer(this._expressApp);
  }

  public listen(cb: () => void | undefined) {
    let _cb = cb;
    if (!cb) {
      _cb = () => {
        console.log(`[Server]: Server Started, running on port ${this._port}`);
      };
    }
    this._httpServer.listen(port);
  }
  public close() {}
}
