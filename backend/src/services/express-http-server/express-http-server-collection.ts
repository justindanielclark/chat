import { Express } from "express";
import ExpressHTTPServer from "./express-http-server";
import ServerNameAlreadyExistsError from "../../utils/errors/ServerNameAlreadyExistsError";
import PortAlreadyInUseError from "../../utils/errors/PortAlreadyInUseError";

type PortsInUse = Set<number>;
type ServerPool = Map<string, ExpressHTTPServer>;

const fileName = "express-http-server-pool.ts";

//Static Class
class ExpressHttpServerCollection {
  private static _portsInUse: PortsInUse = new Set<number>();
  private static _servers: ServerPool = new Map<string, ExpressHTTPServer>();
  public static addServer(name: string, server: ExpressHTTPServer): void {
    if (ExpressHttpServerCollection._servers.get(name)) {
      throw new ServerNameAlreadyExistsError(fileName, "addServer()");
    }
    if (ExpressHttpServerCollection._portsInUse.has(server.getPort())) {
      throw new PortAlreadyInUseError(fileName, "addServer()");
    }
    ExpressHttpServerCollection._portsInUse.add(server.getPort());
    ExpressHttpServerCollection._servers.set(name, server);
  }
  public static createServer(name: string, port: number, app: Express): void {
    if (ExpressHttpServerCollection._servers.get(name)) {
      throw new ServerNameAlreadyExistsError(fileName, "createServer()");
    }
    if (ExpressHttpServerCollection._portsInUse.has(port)) {
      throw new PortAlreadyInUseError(fileName, "createServer()");
    }
    ExpressHttpServerCollection._portsInUse.add(port);
    ExpressHttpServerCollection._servers.set(name, new ExpressHTTPServer(port, app));
  }
  public static getServer(name: string): ExpressHTTPServer | undefined {
    return ExpressHttpServerCollection._servers.get(name);
  }
  public static getPortsInUse(): PortsInUse {
    return ExpressHttpServerCollection._portsInUse;
  }
  public static deleteServer(name: string): void {
    const server = ExpressHttpServerCollection._servers.get(name);
    if (server) {
      server.close();
      ExpressHttpServerCollection._servers.delete(name);
      ExpressHttpServerCollection._portsInUse.delete(server.getPort());
    }
  }
  public static clear() {
    ExpressHttpServerCollection._portsInUse.clear();
    ExpressHttpServerCollection._servers.forEach((server) => {
      server.close();
    });
    ExpressHttpServerCollection._servers.clear();
  }
}

export default ExpressHttpServerCollection;
export { ExpressHttpServerCollection };
