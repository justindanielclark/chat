import HTTP_Server from "../../src/services/httpServer/httpServer";
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

describe("Server", () => {
  const callbacks = [jest.fn(), jest.fn(), jest.fn()];
  const mockServer = http.createServer(); // Mocked Above
  const mockCreateServer = http.createServer as jest.Mock;
  const mockListen = mockServer.listen as jest.Mock;
  const mockClose = mockServer.close as jest.Mock;
  const testPort = 3000;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    HTTP_Server._testing_only_destroy();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("start() calls http.createServer().listen with the provided port", () => {
    it("runs when passed no callbacks", () => {
      HTTP_Server.initialize(testPort);
      HTTP_Server.start();
      expect(mockCreateServer).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledWith(testPort);
      HTTP_Server._testing_only_destroy();
    });
    it("runs through a single callback", () => {
      HTTP_Server.initialize(testPort);
      HTTP_Server.start(callbacks[0]);
      expect(mockCreateServer).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledTimes(1);
      expect(mockListen).toHaveBeenCalledWith(testPort);
      expect(callbacks[0]).toHaveBeenCalledTimes(1);
    });
    it("runs through each callback provided once", () => {
      HTTP_Server.initialize(testPort);
      HTTP_Server.start(callbacks);
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
      HTTP_Server.initialize(testPort);
      HTTP_Server.start();
      HTTP_Server.close();
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
    it("runs through a single callback", () => {
      HTTP_Server.initialize(testPort);
      HTTP_Server.start();
      HTTP_Server.close(callbacks[0]);
      expect(mockClose).toHaveBeenCalledTimes(1);
      expect(callbacks[0]).toHaveBeenCalledTimes(1);
    });
    it("runs through each callback provided once", () => {
      HTTP_Server.initialize(testPort);
      HTTP_Server.start();
      HTTP_Server.close(callbacks);
      expect(mockClose).toHaveBeenCalledTimes(1);
      for (let cb of callbacks) {
        expect(cb).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("getInstance()", () => {
    it("throws an error if called prior to being initialized", () => {
      expect(HTTP_Server.getInstance).toThrow();
    });
  });
});
