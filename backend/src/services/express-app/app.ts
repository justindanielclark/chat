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

const app = express();

app.use(express.static(path.join(__dirname, "..", "..", "..", "..", "..", "_frontend_build")));
app.use("/api", apiRouter);
app.use(defaultRouter);

export default app;
