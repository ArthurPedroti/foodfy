const Chef = require("../models/Chef");

module.exports = {
  index(req, res) {
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

        return res.render("admin/chefs/index", {
          chefs,
          pagination,
          filter
        });
      }
    };

    Chef.paginate(params);
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  show(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef não encontrado!");

      Chef.findRecipes(chef.id, function(recipes) {
        return res.render("admin/chefs/show", { chef, recipes });
      });
    });
  },
  edit(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef não encontrado!");

      return res.render("admin/chefs/edit", { chef });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all the fields!");
    }

    Chef.create(req.body, function(chef) {
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all the fields!");
    }

    Chef.update(req.body, function() {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },
  delete(req, res) {
    Chef.find(req.body.id, function(chef) {
      if (chef.total_recipes > 0)
        return res.send("Você não pode deletar um chef que tenha receitas!");

      Chef.delete(req.body.id, function() {
        return res.redirect("/admin/chefs");
      });
    });
  }
};
