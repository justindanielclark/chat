/*TABS BEFORE LEAVING:
https://socket.io/how-to/use-with-express-session#2nd-use-case-socketio-can-also-create-the-session-context
https://expressjs.com/en/resources/middleware/session.html#sessionoptions
https://expressjs.com/en/resources/middleware/session.html#compatible-session-stores
https://www.npmjs.com/package/express-mysql-session
https://stackoverflow.com/questions/44920856/how-to-use-express-mysql-session-in-typescript-projects*/

import express from "express";
import path from "path";
import apiRouter from "../../routes/api/apiRouter";
import defaultRouter from "../../routes/default/defaultRouter";
import * as session from "express-session";
import express_session, { SessionOptions } from "express-session";
import express_mysql_session from "express-mysql-session";
import ProcessEnvNotConfiguredError from "../../utils/errors/ProcessEnvNotConfiguredError";

const MySQLStore = express_mysql_session(session);
const MySQLStoreOptions = {
  host: "localhost",
  port: 3306,
  user: (() => {
    if (process.env.MYSQL_USER) {
      return process.env.MYSQL_USER;
    }
    throw new ProcessEnvNotConfiguredError("app.ts", "setting MySQLStoreOptions user in main");
  })(),
  password: (() => {
    if (process.env.MYSQL_PASSWORD) {
      return process.env.MYSQL_PASSWORD;
    }
    throw new ProcessEnvNotConfiguredError("app.ts", "setting MySQLStoreOptions password in main");
  })(),
  database: "sessions",
};
const sessionStore = new MySQLStore(MySQLStoreOptions);

const app = express();

const sessionOpt: SessionOptions = {
  // Do not push to production without introducting a proper session store. MemoryStore, the default, is not production ready per:
  // https://expressjs.com/en/resources/middleware/session.html#sessionoptions
  // See compatible Session Stores here: https://expressjs.com/en/resources/middleware/session.html#compatible-session-stores
  secret: "changeit",
  cookie: {
    path: "/", // Root Path of Domain
    maxAge: 900000, // 15 minutes
    sameSite: "strict", // Strict same site enforcement
    /* secure: true
    Likely should be true, 
    TODO: Determine implementation after pushing to production:
     Per Docs:
     Specifies the boolean value for the Secure Set-Cookie attribute. When truthy, the Secure attribute is set, otherwise it is not. By default, the Secure attribute is not set.
     Note be careful when setting this to true, as compliant clients will not send the cookie back to the server in the future if the browser does not have an HTTPS connection.
     Please note that secure: true is a recommended option. However, it requires an https-enabled website, i.e., HTTPS is necessary for secure cookies. If secure is set, and you access your site over HTTP, the cookie will not be set. If you have your node.js behind a proxy and are using secure: true, you need to set “trust proxy” in express:
     */
  },
  resave: false,
  saveUninitialized: false,
};
const sessionMiddleware = express_session(sessionOpt);

app.use(express.static(path.join(__dirname, "..", "..", "..", "_frontend_build")));
app.use(sessionMiddleware);
app.use("/api", apiRouter);
app.use(defaultRouter);

export default app;
