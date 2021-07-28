const express = require("express");
const cors = require("cors");

const { PORT } = require("./constants");
const { router } = require("./controller");

const server = express();

server.use(express.json());
server.use(cors());
server.use("/api", router);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
