const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    results = await Recipe.findAll();
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

    return res.render("web/index", { items: newRecipes.slice(0, 6) });
  },
  async search(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);
    order_by = "updated_at";

    const params = {
      filter,
      page,
      limit,
      offset,
      order_by,
    };

    let results = await Recipe.paginate(params);
    let recipes = results.rows;

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit);

    const pagination = {
      total: mathTotal,
      page,
    };

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

    return res.render("web/search", {
      items: newRecipes,
      pagination,
      filter,
    });
  },
  about(req, res) {
    return res.render("web/about");
  },
  async recipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);
    order_by = "created_at";

    const params = {
      filter,
      page,
      limit,
      offset,
      order_by,
    };

    let results = await Recipe.paginate(params);
    let recipes = results.rows;

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit);

    const pagination = {
      total: mathTotal,
      page,
    };

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

    return res.render("web/recipes", {
      items: newRecipes,
      pagination,
      filter,
    });
  },
  async recipePage(req, res) {
    results = await Recipe.find(req.params.index);
    recipe = results.rows[0];
    results = await Recipe.files(recipe.id);
    const file = results.rows[0].file_id;
    results = await File.find(file);
    recipe.path = results.rows[0].path;
    results = await Chef.find(recipe.chef_id);
    recipe.chef_name = results.rows[0].name;

    recipe.src = `${req.protocol}://${req.headers.host}${recipe.path.replace(
      "public",
      ""
    )}`;

    return res.render("web/recipepage", { item: recipe });
  },
  async chefs(req, res) {
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

    return res.render("web/chefs", {
      chefs,
      pagination,
      filter,
    });
  },
};
