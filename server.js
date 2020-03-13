const express = require("express");
const helmet = require("helmet"); // 1: npm i helmet ; 2 - require

const logger = require("./middlewares/logger");
const projRouter = require("./routes/projects/projRouter");
const actRouter = require("./routes/actions/actRouter");

const server = express();

server.use(helmet()); // 3
server.use(express.json());
server.use(logger);

server.use("/api/projects", projRouter);
server.use("/api/actions", actRouter);

server.get("/", addName("david"), logger, (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  console.log("req.name is:", req.name);

  res.send(`
    <h2>Lambda API Sprint</h2>
    <p>Welcome: ${nameInsert}, to the Lambda API Sprint</p>
    `);
});

function addName(name) {
  return function(req, res, next) {
    req.name = name;

    next();
  };
}

server.use(function notFound(req, res, next) {
  res
    .status(404)
    .json({ message: "Opps, did not find what you're looking for" });
});

module.exports = server;
