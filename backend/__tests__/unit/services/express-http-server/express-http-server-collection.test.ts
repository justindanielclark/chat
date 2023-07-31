import ExpressHTTPServerCollection from "../../../../src/services/express-http-server/express-http-server-collection";
import ExpressHTTPServer from "../../../../src/services/express-http-server/express-http-server";
import express from "express";
import http from "http";

jest.mock("http", () => {
  const originalHttp = jest.requireActual("http");
  const listenMock = jest.fn();
  const closeMock = jest.fn();
  const createServerMock = jest.fn(() => {
    return {
      listen: listenMock,
      close: closeMock,
    };
  });
  return {
    ...originalHttp,
    createServer: createServerMock,
  };
});

describe("ExpressHTTPServerCollection", () => {
  const dummyApp = express();
  const mockServer = http.createServer(); // Mocked Above
  const mockCreateServer = http.createServer as jest.Mock;
  const mockListen = mockServer.listen as jest.Mock;
  const mockClose = mockServer.close as jest.Mock;
  afterEach(() => {
    ExpressHTTPServerCollection.clear();
  });
  describe("addServer()", () => {
    it("is able to add a supplied ExpressHTTPServer", () => {
      const newServer = new ExpressHTTPServer(3000, dummyApp);
      ExpressHTTPServerCollection.addServer("testServer", newServer);
      expect(ExpressHTTPServerCollection.getServer("testServer")).toBe(newServer);
    });
    it("is able to add multiple supplied ExpressHTTPServers", () => {
      const newServer = new ExpressHTTPServer(3000, dummyApp);
      const newServer2 = new ExpressHTTPServer(3001, dummyApp);
      ExpressHTTPServerCollection.addServer("testServer", newServer);
      ExpressHTTPServerCollection.addServer("testServer2", newServer2);
      expect(ExpressHTTPServerCollection.getServer("testServer")).toBe(newServer);
      expect(ExpressHTTPServerCollection.getServer("testServer2")).toBe(newServer2);
    });
    it("throws an error when supplied two servers with the same port", () => {
      const newServer = new ExpressHTTPServer(3000, dummyApp);
      const newServer2 = new ExpressHTTPServer(3000, dummyApp);
      ExpressHTTPServerCollection.addServer("testServer", newServer);
      expect(() => {
        ExpressHTTPServerCollection.addServer("testServer2", newServer2);
      }).toThrow();
    });
    it("throws an error when supplied two servers with the same name", () => {
      const newServer = new ExpressHTTPServer(3000, dummyApp);
      const newServer2 = new ExpressHTTPServer(3001, dummyApp);
      ExpressHTTPServerCollection.addServer("testServer", newServer);
      expect(() => {
        ExpressHTTPServerCollection.addServer("testServer", newServer2);
      }).toThrow();
    });
  });
  describe("createServer()", () => {
    it("is able to create an ExpressHTTPServer when supplied with the required parameters", () => {
      ExpressHTTPServerCollection.createServer("testServer", 3000, dummyApp);
      expect(ExpressHTTPServerCollection.getServer("testServer")).not.toBe(undefined);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(3000)).toBe(true);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(3001)).toBe(false);
    });
    it("is able to create multiple ExpressHTTPServers when supplied the required parameters", () => {
      ExpressHTTPServerCollection.createServer("testServer", 3000, dummyApp);
      ExpressHTTPServerCollection.createServer("testServer2", 3001, dummyApp);
      expect(ExpressHTTPServerCollection.getServer("testServer")).not.toBe(undefined);
      expect(ExpressHTTPServerCollection.getServer("testServer2")).not.toBe(undefined);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(3000)).toBe(true);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(3001)).toBe(true);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(3002)).toBe(false);
    });
    it("throws an error when supplied two servers with the same port", () => {
      ExpressHTTPServerCollection.createServer("testServer", 3000, dummyApp);
      expect(() => {
        ExpressHTTPServerCollection.createServer("testServer2", 3000, dummyApp);
      }).toThrow();
    });
    it("throws an error when supplied two servers with the same name", () => {
      ExpressHTTPServerCollection.createServer("testServer", 3000, dummyApp);
      expect(() => {
        ExpressHTTPServerCollection.createServer("testServer", 3001, dummyApp);
      }).toThrow();
    });
  });
  describe("getPortsInUse()", () => {
    const dummyServer = new ExpressHTTPServer(3000, dummyApp);
    it("returns a set", () => {
      expect(ExpressHTTPServerCollection.getPortsInUse() instanceof Set).toBe(true);
    });
    it("adequately adds port numbers", () => {
      ExpressHTTPServerCollection.addServer("testServer", dummyServer);
      expect(ExpressHTTPServerCollection.getPortsInUse().has(dummyServer.getPort())).toBe(true);
    });
  });
  describe("deleteServer()", () => {
    const dummyServer = new ExpressHTTPServer(3000, dummyApp);
    ExpressHTTPServerCollection.addServer("testServer", dummyServer);
    ExpressHTTPServerCollection.deleteServer("testServer");
    expect(ExpressHTTPServerCollection.getPortsInUse().has(dummyServer.getPort())).toBe(false);
  });
});
