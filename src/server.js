require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(routes);
server.use(cors());

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true
});

server.listen(process.env.PORT || 5000, function() {
  console.log("server is running");
});
