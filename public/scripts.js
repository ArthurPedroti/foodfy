const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .link");

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
}

const modalOverlay = document.querySelector(".modal-overlay");
const cards = document.querySelectorAll(".card");
const recipe_sections = document.querySelectorAll(".recipe__section");

for (let card of cards) {
  card.addEventListener("click", function() {
    const id = card.getAttribute("id");
    window.location.href = `/recipes/${id}`;
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

//Pagination

function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesAfterSelectedPage && pagesBeforeSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);
      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if (pagination) {
  createPagination(pagination);
}
