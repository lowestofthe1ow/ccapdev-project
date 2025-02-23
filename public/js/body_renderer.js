window.addEventListener("load", () => {
    const form = document.querySelector(".search");
    const advSearchForm = document.querySelector(".advsearch");
    const tagsContainers = document.querySelectorAll(".sidebar .tags");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);

      const searchQuery = form.querySelector("input[name='search']").value;
      if (searchQuery) {
        urlParams.set("search", searchQuery);
      } else {
        urlParams.delete("search");
      }

      urlParams.delete("tags[]");
      let selectedTags = [];
      tagsContainers.forEach(container => {
        const tags = container.querySelectorAll(".tags__tag");
        tags.forEach(tag => {
          selectedTags.push(tag.textContent.trim());
        });
      });

      selectedTags.forEach(tag => {
        urlParams.append("tags[]", tag);
      });

      /** PLEASE TELL ME THERE'S A BETTER WAY HERE */
      if (!advSearchForm.classList.contains("hidden")) {
        const startDate = advSearchForm.querySelector('input[name="start_date"]').value;
        const endDate = advSearchForm.querySelector('input[name="end_date"]').value;
        const sortOption = advSearchForm.querySelector('select[name="sort"]').value;
        const authorName = advSearchForm.querySelector('input[name="author_name"]').value;

        if (startDate) urlParams.set("start_date", startDate); else urlParams.delete("start_date");
        if (endDate) urlParams.set("end_date", endDate); else urlParams.delete("end_date");
        if (sortOption) urlParams.set("sort", sortOption); else urlParams.delete("sort");
        if (authorName) urlParams.set("author_name", authorName); else urlParams.delete("author_name");
      } else {
        urlParams.delete("start_date");
        urlParams.delete("end_date");
        urlParams.delete("sort");
        urlParams.delete("author_name");
      }

      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

      window.history.pushState(null, "", newUrl);

      window.location.href = newUrl;
    });
  });

/** Repopulate based on the search  */
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("search") || "";
  const searchInput = document.querySelector("input[name='search']");
  if (searchInput) searchInput.value = searchQuery;

  /** PLEASE TELL ME THERE'S A BETTER WAY HERE */
  const selectedTags = urlParams.getAll("tags[]");
  selectedTags.forEach(tag => {
    const tagElement = document.querySelector(`.tags__tag[data-tag="${tag}"]`);
    if (tagElement) tagElement.classList.add("selected");
  });

  const startDate = urlParams.get("start_date");
  if (startDate) {
    const inputStart = document.querySelector("input[name='start_date']");
    if (inputStart) inputStart.value = startDate;
  }
  const endDate = urlParams.get("end_date");
  if (endDate) {
    const inputEnd = document.querySelector("input[name='end_date']");
    if (inputEnd) inputEnd.value = endDate;
  }
  const sort = urlParams.get("sort");
  if (sort) {
    const selectSort = document.querySelector("select[name='sort']");
    if (selectSort) selectSort.value = sort;
  }
  const authorName = urlParams.get("author_name");
  if (authorName) {
    const inputAuthor = document.querySelector("input[name='author_name']");
    if (inputAuthor) inputAuthor.value = authorName;
  }
});