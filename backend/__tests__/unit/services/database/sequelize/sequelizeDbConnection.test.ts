import {
  SequelizeDatabase,
  SequelizeDbConnection,
} from "../../../../../src/services/database/sequelize/sequelizeDbConnection";

let instance: SequelizeDatabase;

beforeAll(async () => {
  instance = await SequelizeDbConnection.getInstance();
});

afterAll(() => {
  SequelizeDbConnection.clearInstance();
});
