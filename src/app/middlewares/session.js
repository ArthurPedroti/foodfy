const User = require("../models/User");

function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect("/admin/users/login");

  next();
}

async function onlyAdmin(req, res, next) {
  const id = req.session.userId;
  const user = await User.findOne({ where: { id } });
  if (user.is_admin == false) {
    // redirect("/admin");

    return res.render("admin/recipes/index", {
      error: "Apenas admnistradores podem acessar essa área",
    });
  }

  next();
}

function isLoggedRedirectToAdmin(req, res, next) {
  if (req.session.userId) return res.redirect("/admin");

  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToAdmin,
  onlyAdmin,
};
