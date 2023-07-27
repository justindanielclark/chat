import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "_frontend_build")));

app.get("/api/*", (req, res) => {
  res.status(200).send("nice!");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "_frontend_build", "index.html"));
});

server.listen(port, () => {
  console.log(`[server]: Server is up and running at http://localhost:${port}`);
});
