const express = require("express");
const routes = express.Router();

const ChefController = require("../app/controllers/ChefController");
const multer = require("../app/middlewares/multer");

const { onlyUsers, onlyAdmin } = require("../app/middlewares/session");

routes.get("/", onlyUsers, ChefController.index);
routes.get("/create", onlyAdmin, ChefController.create);
routes.get("/:id", onlyUsers, ChefController.show);
routes.get("/:id/edit", onlyAdmin, ChefController.edit);
routes.post("/", onlyAdmin, multer.array("photos", 1), ChefController.post);
routes.put("/", onlyAdmin, multer.array("photos", 1), ChefController.put);
routes.delete("/", onlyAdmin, ChefController.delete);

module.exports = routes;
