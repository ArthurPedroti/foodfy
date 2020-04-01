const fs = require("fs");
data = require("../data.json");

exports.index = function(req, res) {
  return res.render("admin/index", { recipes: data.recipes });
};

exports.create = function(req, res) {
  return res.render("admin/create");
};

exports.show = function(req, res) {
  const { id } = req.params;

  const foundRecipe = data.recipes.find(function(recipe) {
    return recipe.id == id;
  });

  if (!foundRecipe) return res.send("Receita não encontrada!");

  return res.render("admin/show", { recipe: foundRecipe });
};

exports.edit = function(req, res) {
  const { id } = req.params;

  const foundRecipe = data.recipes.find(function(recipe) {
    return recipe.id == id;
  });

  if (!foundRecipe) return res.send("Receita não encontrada!");

  return res.render("admin/edit", { recipe: foundRecipe });
};

exports.post = function(req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") return res.send("Please, fill all the fields!");
  }

  let {
    image,
    title,
    author,
    ingredients,
    preparations,
    information
  } = req.body;
  const created_at = Date.now();

  const id = Number(data.recipes.length + 1);

  data.recipes.push({
    id,
    image,
    title,
    author,
    ingredients,
    preparations,
    information,
    created_at
  });

  fs.writeFile("src/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Erro ao tentar gravar o arquivo");

    return res.redirect("/admin/recipes");
  });

  // return console.log(keys);
};

exports.put = function(req, res) {
  const { id } = req.body;
  let index = 0;

  const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
    if (id == recipe.id) {
      index = foundIndex;
      return true;
    }
  });

  if (!foundRecipe) return res.send("Receita não encontrada");

  const recipe = {
    ...foundRecipe,
    ...req.body
  };

  data.recipes[index] = recipe;
  fs.writeFile("src/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Erro ao atualizar o arquivo");

    return res.redirect(`/admin/recipes/${recipe.id}`);
  });
};

exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredRecipes = data.recipes.filter(function(recipe) {
    return recipe.id != id;
  });

  data.recipes = filteredRecipes;

  fs.writeFile("src/data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Erro ao deletar o arquivo");

    return res.redirect("/admin/recipes");
  });
};
