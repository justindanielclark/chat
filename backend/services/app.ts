import express from "express";
import path from "path";
import apiRouter from "../routes/api/apiRouter";
import defaultRouter from "../routes/default/defaultRouter";

const app = express();

app.use(express.static(path.join(__dirname, "..", "..", "..", "_frontend_build")));
app.use("/api", apiRouter);
app.use(defaultRouter);

export default app;
