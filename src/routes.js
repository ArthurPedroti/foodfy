const express = require("express");
const routes = express.Router();
const web = require("./app/controllers/web");
const recipes = require("./app/controllers/recipes");
const chefs = require("./app/controllers/chefs");

//static pages
routes.get("/", web.index);
routes.get("/about", web.about);
routes.get("/recipes", web.show);
routes.get("/recipes/:index", web.showOne);
routes.get("/chefs", web.chefs);

//administration
routes.get("/admin", function(req, res) {
  return res.redirect("/admin/recipes");
});

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create);
routes.get("/admin/chefs/:id", chefs.show);
routes.get("/admin/chefs/:id/edit", chefs.edit);
routes.post("/admin/chefs", chefs.post);
routes.put("/admin/chefs", chefs.put);
routes.delete("/admin/chefs", chefs.delete);

module.exports = routes;
