const Chef = require("../models/Chef");
const File = require("../models/File");
const Recipe = require("../models/Recipe");

module.exports = {
  async index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 16;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
    };

    results = await Chef.paginate(params);
    chefs = results.rows;

    let mathTotal =
      chefs[0] == undefined ? 0 : Math.ceil(chefs[0].total / limit);

    const pagination = {
      total: mathTotal,
      page,
    };

    chefs = chefs.map(async (chef) => {
      results = await File.find(chef.file_id);
      file = results.rows[0];
      file = `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`;
      chef.file_path = file;
      return chef;
    });

    chefs = await Promise.all(chefs);

    return res.render("admin/chefs/index", {
      chefs,
      pagination,
      filter,
    });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async show(req, res) {
    let results = await Chef.find(req.params.id);
    chef = results.rows[0];
    results = await File.find(chef.file_id);
    file = results.rows[0];
    file.path = `${req.protocol}://${req.headers.host}${file.path.replace(
      "public",
      ""
    )}`;
    results = await Chef.findRecipes(chef.id);
    recipes = results.rows;
    newRecipes = recipes.map(async (recipe) => {
      let results = await Recipe.files(recipe.id);
      const file = results.rows[0].file_id;
      results = await File.find(file);
      recipe.path = results.rows[0].path;
      results = await Chef.find(recipe.chef_id);
      recipe.chef_name = results.rows[0].name;
      return recipe;
    });
    await Promise.all(newRecipes);

    newRecipes = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/chefs/show", { chef, file, recipes: newRecipes });
  },
  async edit(req, res) {
    results = await Chef.find(req.params.id);
    chef = results.rows[0];

    results = await File.find(chef.file_id);
    let files = results.rows;
    files = files.map((file) => ({
      ...file,
      file_path: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/chefs/edit", { chef, files });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") return res.send("Please, fill all the fields!");
    }

    if (req.files.length == 0) {
      return res.send("Por favor, envie pelo menos uma imagem");
    }

    results = await File.create(...req.files);
    file_id = results.rows[0].id;
    results = await Chef.create(req.body, file_id);
    chef_id = results.rows[0].id;

    return res.redirect(`/admin/chefs/${chef_id}`);
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    results = await Chef.find(req.body.id);
    let file_id = results.rows[0].file_id;

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files")
        return res.send("Preencha todos os campos!");
    }

    if (req.files.length != 0) {
      results = await File.create(...req.files);
      file_id = results.rows[0].id;
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      await File.delete(removedFiles);
    }

    Chef.update(req.body, file_id);
    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    results = await Chef.find(req.body.id);
    const chef = results.rows[0];
    if (chef.total_recipes > 0)
      return res.send("Você não pode deletar um chef que tenha receitas!");

    await Chef.delete(req.body.id);
    await File.delete(chef.file_id);

    return res.redirect("/admin/chefs");
  },
};
