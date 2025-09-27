const recipeList = document.getElementById("recipe-list");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim() || "c";
  fetchByQuery(q);
});
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

fetchByQuery("c");

function fetchByQuery(q) {
  recipeList.innerHTML = '<p style="color:var(--muted)">Loading recipes…</p>';
  const useFirstLetter = q.length === 1;
  const url = useFirstLetter
    ? "https://www.themealdb.com/api/json/v1/1/search.php?f=" +
      encodeURIComponent(q)
    : "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
      encodeURIComponent(q);

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const meals = data.meals;
      if (!meals) {
        recipeList.innerHTML =
          '<p style="color:var(--muted)">No recipes found. Try another query.</p>';
        return;
      }
      recipeList.innerHTML = meals
        .map((meal) => {
          return `
          <article class="card">
            <img src="${meal.strMealThumb}" alt="${escapeHtml(meal.strMeal)}" />
            <h3>${escapeHtml(meal.strMeal)}</h3>
            <p><strong>Category:</strong> ${escapeHtml(
              meal.strCategory || ""
            )}</p>
            <p><strong>Area:</strong> ${escapeHtml(meal.strArea || "")}</p>
            <a href="recipe.html?id=${meal.idMeal}">View Recipe →</a>
          </article>
        `;
        })
        .join("");
    })
    .catch((err) => {
      console.error(err);
      recipeList.innerHTML =
        '<p style="color:var(--muted)">Failed to load recipes. Check your internet connection.</p>';
    });
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
