import Express_HTTP_Server from "../../../../src/services/express-http-server/express-http-server";
import http from "http";
import express from "express";

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

describe("Express_HTTP_Server", () => {
  const dummyApp = express();
  const callbacks = [jest.fn(), jest.fn(), jest.fn()];
  const mockServer = http.createServer(); // Mocked Above
  const mockCreateServer = http.createServer as jest.Mock;
  const mockListen = mockServer.listen as jest.Mock;
  const mockClose = mockServer.close as jest.Mock;
  const testPort = 3000;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("start() calls http.createServer().listen with the provided port", () => {
    it("runs when passed no callbacks", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start();
      expect(mockCreateServer).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledWith(testPort);
    });
    it("runs through a single callback", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start(callbacks[0]);
      expect(mockCreateServer).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledWith(testPort);
      expect(callbacks[0]).toHaveBeenCalledTimes(1);
    });
    it("runs through each callback provided once", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start(callbacks);
      expect(mockCreateServer).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledWith(testPort);
      for (let cb of callbacks) {
        expect(cb).toHaveBeenCalledTimes(1);
      }
    });
  });
  describe("close() calls http.createServer().close", () => {
    it("runs when passed no callbacks", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start();
      server.close();
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
    it("runs through a single callback", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start();
      server.close(callbacks[0]);
      expect(mockClose).toHaveBeenCalledTimes(1);
      expect(callbacks[0]).toHaveBeenCalledTimes(1);
    });
    it("runs through each callback provided once", () => {
      const server = new Express_HTTP_Server(testPort, dummyApp);
      server.start();
      server.close(callbacks);
      expect(mockClose).toHaveBeenCalledTimes(1);
      for (let cb of callbacks) {
        expect(cb).toHaveBeenCalledTimes(1);
      }
    });
  });
});
