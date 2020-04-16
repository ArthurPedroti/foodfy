const db = require("../../config/db");
const { date } = require("../../lib/utils");
const User = require("./User");

module.exports = {
  create(data) {
    const query = `
      INSERT INTO recipes (
        user_id,
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `;

    const values = [
      data.user_id,
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    try {
      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },
  find(id) {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  findAll() {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      `
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  update(data, callback) {
    const query = `
      UPDATE recipes SET 
        chef_id=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
    `;

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id,
    ];

    try {
      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },
  delete(id, callback) {
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },
  async paginate(params) {
    const { filter, limit, offset, order_by, user_id: id } = params;
    console.log(id);
    let user = await User.findOne({ where: { id } });
    let adminQuery = ``;

    if (user.is_admin == false) {
      adminQuery = `
        AND recipes.user_id = '${id}'
      `;
    }
    console.log(adminQuery);

    let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM recipes
      ) AS total`;

    if (filter) {
      filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
      `;

      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`;
    }

    query = `
      SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name, images.array_to_string as files_id
      FROM recipes
      JOIN chefs ON (recipes.chef_id = chefs.id)
      JOIN (
        SELECT recipe_id, array_to_string(array_agg(file_id), ',')
        FROM recipe_files
        GROUP BY recipe_id
      ) images ON (recipes.id = images.recipe_id)
      ${filterQuery}
      ${adminQuery}
      ORDER BY ${order_by} LIMIT $1 OFFSET $2
    `;

    // query = `
    //   SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name, recipe_files.file_id as file_ids
    //   FROM recipes
    //   JOIN chefs ON (recipes.chef_id = chefs.id) JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
    //   ${filterQuery}
    //   LIMIT $1 OFFSET $2
    // `;

    // db.query(query, [limit, offset], function (err, results) {
    //   if (err) throw `Database Error! ${err}`;

    //   callback(results.rows);
    // });

    try {
      return db.query(query, [limit, offset]);
    } catch (err) {
      throw new Error(err);
    }
  },
  chefSelectOptions() {
    try {
      return db.query(`
      SELECT name, id FROM chefs
    `);
    } catch (err) {
      throw new Error(err);
    }
  },
  files(id) {
    try {
      return db.query(
        `
        SELECT * FROM recipe_files WHERE recipe_id = $1 
      `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
