const User = require("./src/app/models/User");

async function creteAdmin() {
  await User.create({
    name: "Arthur Pedroti",
    email: "arthurpedroti@gmail.com",
    is_admin: true,
  });
}

creteAdmin();
