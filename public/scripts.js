const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".card");
const recipe_sections = document.querySelectorAll(".recipe__section");

for (let card of cards) {
  card.addEventListener("click", function() {
    const index = card.getAttribute("id");
    window.location.href = `/recipes/${index}`;
  });
}

for (let recipe_section of recipe_sections) {
  const section = recipe_section.querySelector(".recipe__description");
  recipe_section
    .querySelector(".recipe__expansion")
    .addEventListener("click", function() {
      if (section.classList.contains("active") === true) {
        section.classList.remove("active");
        recipe_section.querySelector(".recipe__expansion").innerHTML =
          "MOSTRAR";
      } else {
        section.classList.add("active");
        recipe_section.querySelector(".recipe__expansion").innerHTML =
          "ESCONDER";
      }
    });
}
