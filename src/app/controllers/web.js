const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
  index(req, res) {
    Recipe.findAll(function(recipes) {
      return res.render("web/index", { items: recipes.slice(0, 6) });
    });
  },
  about(req, res) {
    return res.render("web/about");
  },
  show(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;
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

        return res.render("web/recipes", {
          items: recipes,
          pagination,
          filter
        });
      }
    };

    Recipe.paginate(params);
  },
  showOne(req, res) {
    Recipe.find(req.params.index, function(recipe) {
      if (!recipe) return res.send("Receita não encontrada!");

      return res.render("web/recipepage", { item: recipe });
    });
  },
  chefs(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 16;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(chefs) {
        let mathTotal =
          chefs[0] == undefined ? 0 : Math.ceil(chefs[0].total / limit);

        const pagination = {
          total: mathTotal,
          page
        };

        return res.render("web/chefs", {
          chefs,
          pagination,
          filter
        });
      }
    };

    Chef.paginate(params);
  }
};
