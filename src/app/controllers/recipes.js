const Recipe = require("../models/Recipe");

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        let mathTotal =
          recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit);

        const pagination = {
          total: mathTotal,
          page
        };

        return res.render("admin/recipes/index", {
          recipes,
          pagination,
          filter
        });
      }
    };

    Recipe.paginate(params);
  },
  create(req, res) {
    Recipe.chefSelectOptions(function(options) {
      return res.render("admin/recipes/create", { chefOptions: options });
    });
  },
  show(req, res) {
    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Receita não encontrada!");

      return res.render("admin/recipes/show", { recipe });
    });
  },
  edit(req, res) {
    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Receita não encontrado!");

      Recipe.chefSelectOptions(function(options) {
        return res.render("admin/recipes/edit", {
          recipe,
          chefOptions: options
        });
      });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all the fields!");
    }

    Recipe.create(req.body, function(recipe) {
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all the fields!");
    }
    Recipe.update(req.body, function() {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function() {
      return res.redirect("/admin/recipes");
    });
  }
};
