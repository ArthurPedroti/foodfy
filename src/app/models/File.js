const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  create({ filename, path }) {
    const query = `
    INSERT INTO files (
      name,
      path
    ) VALUES ($1, $2)
    RETURNING id
  `;
    const values = [filename, path];

    try {
      return db.query(query, values);
    } catch (err) {
      throw new Error(err);
    }
  },
  find(id) {
    try {
      return db.query(`SELECT * FROM files WHERE id = $1 `, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0];

      fs.unlinkSync(file.path);

      return db.query(
        `
        DELETE FROM files WHERE id = $1
      `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteRecipe(id) {
    try {
      return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteAllRecipeFiles(id) {
    try {
      return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [id]);
    } catch (err) {
      throw new Error(err);
    }
  },
  recipeImages(id) {
    try {
      return db.query(
        `
        SELECT recipe_files.*, files.path as file_path
        FROM recipe_files
        LEFT JOIN files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1 
      `,
        [id]
      );
    } catch (err) {
      throw new Error(err);
    }
  },
};
