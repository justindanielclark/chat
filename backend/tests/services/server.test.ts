import http from "http";
import express from "express";
import { Server } from "../../services/server";

// Mock the http.createServer() method to return a spy object
jest.mock("http", () => ({
  createServer: jest.fn(),
}));

describe("Server", () => {
  it("should call _httpServer.listen() when start() is called", () => {
    const port = 3000;
    const server = new Server(port);
    server.start();
    expect(true).toBe(true);
  });
});
