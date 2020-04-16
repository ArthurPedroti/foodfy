const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  //check if has all fiels
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "")
      return {
        user: body,
        error: "Preencha todos os campos!",
      };
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.render("admin/user/create", fillAllFields);

  //check if users exists [email,cpf_cnpj]
  let { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user)
    return res.render("admin/user/create", {
      user: req.body,
      error: "Usuário já cadastrado",
    });

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.render(`admin/user/edit`, fillAllFields);

  //check if users exists [email,cpf_cnpj]
  let { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user)
    return res.render("admin/user/edit", {
      user: req.body,
      error: "Email já cadastrado",
    });

  next();
}

module.exports = {
  post,
  put,
};
