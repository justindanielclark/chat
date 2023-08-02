import request from "supertest";
import app from "../../../src/services/express-app/app";

describe("/api/login", () => {
  //TODO
  it("GET", async () => {
    const response = await request(app).get("/api/login");
    expect(response.status).toBe(200);
    expect(response.text).toBe("login route get");
  });
  it("POST", async () => {
    const response = await request(app).post("/api/login");
    expect(response.status).toBe(200);
    expect(response.text).toBe("login route post");
  });
});
