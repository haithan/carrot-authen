const express = require("express");
const cors = require("cors");
const api = require("./api");
const logger = require("./api/utils/logger");
const server = express();

const port = parseInt(process.env.PORT, 10) || 3000;

server.use(cors());
server.use(logger);

server.get("/ping", (req, res) => {
  return res.send("pong");
});

server.get("/test", (req, res) => {
  res.json(process.env);
});

server.use("/", api);

server.listen(port, (err) => {
  if (err) throw err;
  console.log(
    `> Ready on http://localhost:${port}`
  ); /* eslint-disable no-console */
});

module.exports = server;
