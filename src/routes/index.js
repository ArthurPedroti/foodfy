const express = require("express");
const routes = express.Router();

const WebController = require("../app/controllers/WebController");

const admin = require("./admin");

routes.use("/admin", admin);
//home
routes.get("/", WebController.index);

// search
routes.get("/recipes/search", WebController.search);

//static pages
routes.get("/about", WebController.about);
routes.get("/recipes", WebController.recipes);
routes.get("/recipes/:index", WebController.recipePage);
routes.get("/chefs", WebController.chefs);

//administration
routes.get("/admin", function (req, res) {
  return res.redirect("/admin/recipes");
});

module.exports = routes;
