const express = require("express");
const cors = require("cors");
const api = require("./api");
const logger = require("./logger");
const server = express();

const port = parseInt(process.env.PORT, 10) || 3000;

server.use(logger);
server.use(cors());

server.get("/ping", (req, res) => {
  return res.send("pong");
});

// mount the APIs
server.use("/api/v1", api);

server.listen(port, (err) => {
  if (err) throw err;
  console.log(
    `> Ready on http://localhost:${port}`
  ); /* eslint-disable no-console */
});

module.exports = server;
