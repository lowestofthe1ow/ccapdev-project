function initializeTagSearch(inputSelector, tagsSelector, dropdownSelector, apiUrl) {
    const inputField = document.querySelector(inputSelector);
    const tagsContainer = document.querySelector(tagsSelector);
    const dropdown = document.querySelector(dropdownSelector);
    let selectedTags = new Set();

    async function fetchTags(query) {
        try {
            const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`);
            const tags = await response.json();

            dropdown.innerHTML = "";

            if (tags.length === 0) {
                dropdown.style.display = "none";
                return;
            }

            tags.forEach(tagText => {
                if (!selectedTags.has(tagText)) {
                    const tagOption = document.createElement("div");
                    tagOption.classList.add("dropdown_item");
                    tagOption.textContent = tagText;

                    tagOption.addEventListener("mouseenter", () => {
                        tagOption.style.background = "#f0f0f0";
                    });
                    tagOption.addEventListener("mouseleave", () => {
                        tagOption.style.background = "white";
                    });

                    tagOption.addEventListener("click", () => {
                        addTag(tagText);
                        dropdown.style.display = "none";
                        inputField.value = "";
                    });

                    dropdown.appendChild(tagOption);
                }
            });

            dropdown.style.display = "block";
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }

    function addTag(tagText) {
        if (!selectedTags.has(tagText)) {
            selectedTags.add(tagText);

            const tag = document.createElement("div");
            tag.classList.add("tags__tag");
            tag.textContent = tagText;

            tag.addEventListener("click", () => {
                selectedTags.delete(tagText);
                tag.remove();
            });

            tagsContainer.appendChild(tag);
        }
    }

    let debounceTimer;
    inputField.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const searchQuery = inputField.value.trim();

        if (searchQuery.length > 0) {
            debounceTimer = setTimeout(() => fetchTags(searchQuery), 200);
        } else {
            dropdown.style.display = "none";
        }
    });

    document.addEventListener("click", (event) => {
        if (!inputField.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });
}
