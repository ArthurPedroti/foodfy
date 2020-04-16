const express = require("express");
const routes = express.Router();

const ChefController = require("../app/controllers/ChefController");
const multer = require("../app/middlewares/multer");

routes.get("/", ChefController.index);
routes.get("/create", ChefController.create);
routes.get("/:id", ChefController.show);
routes.get("/:id/edit", ChefController.edit);
routes.post("/", multer.array("photos", 1), ChefController.post);
routes.put("/", multer.array("photos", 1), ChefController.put);
routes.delete("/", ChefController.delete);

module.exports = routes;
