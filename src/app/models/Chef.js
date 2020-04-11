const db = require("../../config/db");
const { date } = require("../../lib/utils");

module.exports = {
  create(data, file_id) {
    const query = `
      INSERT INTO chefs (
        name,
        created_at,
        file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
    `;

    const values = [data.name, date(Date.now()).iso, file_id];

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
          SELECT chefs.*, count(recipes) AS total_recipes
          FROM chefs
          LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
          WHERE chefs.id = $1
          GROUP BY chefs.id
        `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  update(data, file_id) {
    try {
      return db.query(
        `
      UPDATE chefs SET 
        name=($1),
        file_id=($2)
      WHERE id = $3
    `,
        [data.name, file_id, data.id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },
  paginate(params) {
    const { filter, limit, offset } = params;

    let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM chefs
      ) AS total`;

    if (filter) {
      filterQuery = `
        WHERE chefs.name ILIKE '%${filter}%'
      `;

      totalQuery = `(
        SELECT count(*) FROM chefs
        ${filterQuery}
      ) AS total`;
    }

    query = `
      SELECT chefs.*, ${totalQuery}, count(recipes) as total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      ${filterQuery}
      GROUP BY chefs.id LIMIT $1 OFFSET $2
    `;
    try {
      return db.query(query, [limit, offset]);
    } catch (err) {
      throw new Error(err);
    }
    db.query(query, [limit, offset]);
  },
  findRecipes(id) {
    try {
      return db.query(
        `
        SELECT *
        FROM recipes
        WHERE recipes.chef_id = $1
      `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
