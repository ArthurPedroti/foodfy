const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".card");

for (let card of cards) {
  card.addEventListener("click", function() {
    modalOverlay.classList.add("active");
    const img = card.querySelector("img").src;
    const title = card.querySelector(".card__title").innerHTML;
    const subtitle = card.querySelector(".card__subtitle").innerHTML;
    modalOverlay.querySelector("img").src = img;
    modalOverlay.querySelector(".modal__title").innerHTML = title;
    modalOverlay.querySelector(".modal__subtitle").innerHTML = subtitle;
  });
}

document.querySelector(".modal__button").addEventListener("click", function() {
  modalOverlay.classList.remove("active");
});
