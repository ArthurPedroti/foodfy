const express = require("express");
const routes = express.Router();

const ProfileController = require("../app/controllers/ProfileController");
const ProfileValidator = require("../app/validators/profile");

// Rotas de perfil de um usuário logado
routes.get("/", ProfileValidator.index, ProfileController.index); // Mostrar o formulário com dados do usuário logado
routes.put("/", ProfileValidator.put, ProfileController.put); // Editar o usuário logado

module.exports = routes;
