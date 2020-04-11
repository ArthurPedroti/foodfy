const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");

const WebController = require("./app/controllers/WebController");
const RecipeController = require("./app/controllers/RecipeController");
const ChefController = require("./app/controllers/ChefController");

//static pages
routes.get("/", WebController.index);
routes.get("/about", WebController.about);
routes.get("/recipes", WebController.show);
routes.get("/recipes/:index", WebController.showOne);
routes.get("/chefs", WebController.chefs);

//administration
routes.get("/admin", function (req, res) {
  return res.redirect("/admin/recipes");
});

routes.get("/admin/recipes", RecipeController.index);
routes.get("/admin/recipes/create", RecipeController.create);
routes.get("/admin/recipes/:id", RecipeController.show);
routes.get("/admin/recipes/:id/edit", RecipeController.edit);
routes.post("/admin/recipes", multer.array("photos", 5), RecipeController.post);
routes.put("/admin/recipes", multer.array("photos", 5), RecipeController.put);
routes.delete("/admin/recipes", RecipeController.delete);

routes.get("/admin/chefs", ChefController.index);
routes.get("/admin/chefs/create", ChefController.create);
routes.get("/admin/chefs/:id", ChefController.show);
routes.get("/admin/chefs/:id/edit", ChefController.edit);
routes.post("/admin/chefs", multer.array("photos", 1), ChefController.post);
routes.put("/admin/chefs", multer.array("photos", 1), ChefController.put);
routes.delete("/admin/chefs", ChefController.delete);

module.exports = routes;
