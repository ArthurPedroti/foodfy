const db = require("../../config/db");
const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

const File = require("../models/File");

const fs = require("fs");

module.exports = {
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map((key) => {
      // WHERE | OR | AND
      query = `${query}
      ${key}`;

      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    results = await db.query(query);

    return results.rows[0];
  },
  async all() {
    try {
      results = await db.query(`SELECT * FROM users`);
      return results.rows;
    } catch (err) {
      console.error(err);
    }
  },
  async create(data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

      //check if is admin
      if (!data.is_admin) data.is_admin = false;

      //generate a randow password
      const password = crypto.randomBytes(4).toString("hex");

      //hash of password
      const passwordHash = await hash(password, 8);

      //creating user on db
      const values = [data.name, data.email, passwordHash, data.is_admin];
      const results = await db.query(query, values);

      //send an email with the password
      await mailer.sendMail({
        to: data.email,
        from: "no-reply@foodfy.com",
        subject: "Bem vindo ao Foodfy!",
        html: `
              <h1>Bem vindo ao Foodfy!</h1>
              <p>Segue a sua nova senha para acesso ao site:${password}</p>
              `,
      });

      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  },
  async update(id, fields) {
    let query = "UPDATE users SET";

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `;
      } else {
        //last interaction
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
          `;
      }
    });

    await db.query(query);
    return;
  },
  async delete(id) {
    //pick all recipes
    let results = await db.query("SELECT * FROM recipes WHERE user_id = $1", [
      id,
    ]);
    const recipes = results.rows;

    //remove user
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    //remove all images
    const allFilesPromise = recipes.map((recipe) =>
      File.deleteByRecipe(recipe.id)
    );
    let promiseResults = await Promise.all(allFilesPromise);
  },
};
