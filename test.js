const data = require("./package.json");
const dependencies = data.dependencies;

for (let dependencie in dependencies) {
  console.log(dependencies);
  console.log(dependencie);

  return (
    <li>
      {dependencie}: {dependencies[dependencie]}
    </li>
  );
}
