// getPort.test.ts
import getPort from "../../src/utils/process_dot_env/getPort";

const OLD_ENV = { ...process.env };
const defaultPort = 5000;

afterEach(() => {
  process.env = { ...OLD_ENV };
});

describe("getPort function", () => {
  it("should return the port of process.env if set", () => {
    process.env.PORT = "3000";
    expect(getPort({ portIfProcessEnvUninstantiated: defaultPort })).toBe(3000);
  });
  it("should return the default port when process.env.PORT is not set", () => {
    process.env.PORT = undefined;
    expect(getPort({ portIfProcessEnvUninstantiated: defaultPort })).toBe(defaultPort);
  });
});
