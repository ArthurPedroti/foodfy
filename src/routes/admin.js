const express = require("express");
const routes = express.Router();

const recipes = require("./recipes");
const chefs = require("./chefs");
const users = require("./users");
const profile = require("./profile");

routes.use("/recipes", recipes);
routes.use("/chefs", chefs);
routes.use("/users", users);
routes.use("/profile", profile);

module.exports = routes;
