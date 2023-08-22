import ProcessEnvNotConfiguredError from "../../../utils/errors/ProcessEnvNotConfiguredError";
const connectionParameters = {
  database: (() => {
    if (process.env.NODE_ENV === "production") {
      if (process.env.MYSQL_DATABASE_NAME) {
        return process.env.MYSQL_DATABASE_NAME;
      }
    } else {
      if (process.env.TEST_MYSQL_DATABASE_NAME) {
        return process.env.TEST_MYSQL_DATABASE_NAME;
      }
    }
    throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize database name");
  })(),
  username: (() => {
    if (process.env.MYSQL_USER) {
      return process.env.MYSQL_USER;
    }
    throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize username");
  })(),
  password: (() => {
    if (process.env.MYSQL_PASSWORD) {
      return process.env.MYSQL_PASSWORD;
    }
    throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize password");
  })(),
  host: (() => {
    if (process.env.MYSQL_HOST) {
      return process.env.MYSQL_HOST;
    }
    throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize hostname");
  })(),
  port: (() => {
    if (process.env.MYSQL_PORT) {
      const port = parseInt(process.env.MYSQL_PORT);
      if (!isNaN(port)) {
        return port;
      }
    }
    throw new ProcessEnvNotConfiguredError("sequelizeDBConnection.ts", "setting sequelize port");
  })(),
};
export default connectionParameters;
