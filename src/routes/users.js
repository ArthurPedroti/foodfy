const express = require("express");
const routes = express.Router();

const UserController = require("../app/controllers/UserController");
const SessionController = require("../app/controllers/SessionController");

const UserValidator = require("../app/validators/users");
const SessionValidator = require("../app/validators/session");

// // login/logout
routes.get("/login", SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

// // reset password / forgot
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post(
  "/forgot-password",
  SessionValidator.forgot,
  SessionController.forgot
);
routes.post("/password-reset", SessionValidator.reset, SessionController.reset);

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get("/create", UserController.create); //Cadastrar um usuário
routes.get("/edit/:id", UserController.edit); //Cadastrar um usuário

routes.get("/", UserController.list); //Mostrar a lista de usuários cadastrados
routes.post("/", UserValidator.post, UserController.post); //Cadastrar um usuário
routes.put("/", UserValidator.put, UserController.put); // Editar um usuário
routes.delete("/", UserController.delete); // Deletar um usuário

module.exports = routes;
