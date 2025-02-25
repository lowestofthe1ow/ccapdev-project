window.addEventListener("load", () => {
  const form = document.querySelector(".search");
  const advSearchForm = document.querySelector(".advsearch");
  const gameTagsContainer = advSearchForm.querySelector(".game__search .tags");
  const tagSearchContainer = advSearchForm.querySelector(".tag__search .tags");

  form.addEventListener("submit", (event) => {
      event.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = form.querySelector("input[name='search']").value.trim();

      searchQuery ? urlParams.set("search", searchQuery) : urlParams.delete("search");

      if (!advSearchForm.classList.contains("hidden")) {
          ["start_date", "end_date", "sort", "author_name"].forEach(param => {
              const value = advSearchForm.querySelector(`[name="${param}"]`)?.value.trim();
              value ? urlParams.set(param, value) : urlParams.delete(param);
          });

          const sortField = advSearchForm.querySelector("select[name='sort']");
          const selectedIndex = sortField?.selectedIndex ?? 0;
          selectedIndex > 0 ? urlParams.set("sort", selectedIndex.toString()) : urlParams.delete("sort");

          urlParams.delete("games");
          if (gameTagsContainer) {
              const gameTags = Array.from(gameTagsContainer.querySelectorAll(".tags__tag"))
                  .map(tag => encodeURIComponent(tag.textContent.trim()))
                  .join("|");
              if (gameTags) urlParams.set("games", gameTags);
          }

          urlParams.delete("tags");
          if (tagSearchContainer) {
              const tags = Array.from(tagSearchContainer.querySelectorAll(".tags__tag"))
                  .map(tag => encodeURIComponent(tag.textContent.trim()))
                  .join("|");
              if (tags) urlParams.set("tags", tags);
          }
      } else {
    
          ["start_date", "end_date", "sort", "author_name", "games", "tags"].forEach(param => urlParams.delete(param));
      }
      window.location.href = `/threads?${urlParams.toString()}`;
  });
});



/** Repopulate based on the url/uri/urn/ whtever they are called */
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("search") || "";
  const searchInput = document.querySelector("input[name='search']");
  if (searchInput) searchInput.value = searchQuery;

  ["start_date", "end_date", "sort", "author_name"].forEach(param => {
    const field = document.querySelector(`[name="${param}"]`);
    if (field) {
      const value = urlParams.get(param);
      if (value) {
        field.value = value;
      } else if (param === "sort") {
        field.value = field.options[0].value;
      }
    }
  });

  function populateTags(containerSelector, queryParam, extraClass = "") {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const tags = urlParams.get(queryParam);
    if (tags) {
      tags.split("|").forEach(tag => addTag(container, decodeURIComponent(tag), extraClass));
    }
  }

  function addTag(container, tagText, extraClass = "") {
    const tag = document.createElement("div");
    tag.classList.add("tags__tag");
    if (extraClass) tag.classList.add(extraClass);
    tag.textContent = tagText;
    container.appendChild(tag);
  }
  populateTags(".game__search .tags", "games", "tags__tag--game");
  populateTags(".tag__search .tags", "tags");

});