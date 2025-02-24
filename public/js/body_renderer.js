window.addEventListener("load", () => {
    const form = document.querySelector(".search");
    const advSearchForm = document.querySelector(".advsearch");
    const tagsContainers = document.querySelectorAll(".sidebar .tags"); 
    /** NOT GONNA WORK LMAO, 3 TAG CONTAINERS, I NEED TO DIFFERENTIATE BETWEEN THE THREE*/

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
      
      if (!advSearchForm.classList.contains("hidden")) {
        
          ["start_date", "end_date", "sort", "author_name"].forEach(param => {
              const value = advSearchForm.querySelector(`[name="${param}"]`)?.value.trim();
              value ? urlParams.set(param, value) : urlParams.delete(param);
          });

          const sortField = advSearchForm.querySelector("select[name='sort']");
          const selectedIndex = sortField?.selectedIndex ?? 0;
          selectedIndex > 0 ? urlParams.set("sort", selectedIndex.toString()) : urlParams.delete("sort");
      } else {
          ["start_date", "end_date", "sort", "author_name"].forEach(param => urlParams.delete(param));
      }
      
      window.location.href = `?${urlParams.toString()}`;
    });
  });

/** Repopulate based on the search  */
/** tag not working */
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const searchQuery = urlParams.get("search") || "";
  const searchInput = document.querySelector("input[name='search']");
  if (searchInput) searchInput.value = searchQuery;

  ["start_date", "end_date", "sort", "author_name"].forEach(param => {
    const field = document.querySelector(`[name="${param}"]`);
    if (field) field.value = urlParams.get(param) || "";
  });
});