const config = require("config");
const io = require("socket.io-client");

const socket = io.connect(config.get("services.chat"), {
  extraHeaders: { Authorization: `Bearer ${config.get("jwt.server")}` },
});

socket.on("connect", () => {
  console.log("connecting");
});

socket.on("connected", (skt) => {
  console.log("connected", skt);
});

module.exports = socket;
