const express = require("express");
const routes = express.Router();
const recipes = require("./controllers/recipes");
const data = require("./data.json");

//static pages
routes.get("/", function(req, res) {
  return res.render("index", { items: data.recipes.slice(0, 6) });
});
routes.get("/about", function(req, res) {
  return res.render("about");
});
routes.get("/recipes", function(req, res) {
  return res.render("recipes", { items: data.recipes });
});
routes.get("/recipes/:index", function(req, res) {
  const recipeIndex = req.params.index;
  if (data.recipes[recipeIndex] === undefined) {
    return res.send("Receita não encontrada!");
  } else {
    return res.render("recipepage", { item: data.recipes[recipeIndex] });
  }
});

//administration
routes.get("/admin", function(req, res) {
  return res.redirect("/admin/recipes");
});
routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

module.exports = routes;
