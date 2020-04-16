const express = require("express");
const routes = express.Router();

const RecipeController = require("../app/controllers/RecipeController");
const multer = require("../app/middlewares/multer");

const { onlyUsers } = require("../app/middlewares/session");

// search
routes.get("/search", RecipeController.index);

routes.get("/", onlyUsers, RecipeController.index);
routes.get("/create", onlyUsers, RecipeController.create);
routes.get("/:id", onlyUsers, RecipeController.show);
routes.get("/:id/edit", onlyUsers, RecipeController.edit);
routes.post("/", onlyUsers, multer.array("photos", 5), RecipeController.post);
routes.put("/", onlyUsers, multer.array("photos", 5), RecipeController.put);
routes.delete("/", onlyUsers, RecipeController.delete);

module.exports = routes;
