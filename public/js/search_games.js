window.addEventListener("load", () => {
    const gameSearchContainers = document.querySelectorAll(".game__search");
    const tagSearchContainers = document.querySelectorAll(".tag__search");
    const form = document.querySelector(".advsearch");

    /** GAME SEARCH */
    gameSearchContainers.forEach(container => {
        const inputField = container.querySelector(".advsearch__input");
        const tagsContainer = container.querySelector(".tags");
        const dropdown = container.querySelector(".dropdown");
        
        let selectedTags = new Set();
        container.selectedTags = selectedTags;

        async function fetchTags(query) {
            try {
                const response = await fetch(`/games?q=${encodeURIComponent(query)}`);
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

                        tagOption.addEventListener("mouseenter", () => tagOption.style.background = "#f0f0f0");
                        tagOption.addEventListener("mouseleave", () => tagOption.style.background = "white");
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
                tag.classList.add("tags__tag", "tags__tag--game");
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
            if (!container.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });
    });

    /** TAG SEARCH */
    tagSearchContainers.forEach(container => {
        const inputField = container.querySelector(".advsearch__input");
        const tagsContainer = container.querySelector(".tags");
        
        let selectedTags = new Set();
        container.selectedTags = selectedTags;

        function addTag(tagText) {
            tagText = `#${tagText.trim()}`;
            if (!selectedTags.has(tagText) && tagText.length > 1) {
                selectedTags.add(tagText);

                const tag = document.createElement("div");
                tag.classList.add("tags__tag");
                tag.textContent = tagText;

                tag.addEventListener("click", () => {
                    selectedTags.delete(tagText);
                    tag.remove();
                });

                tagsContainer.appendChild(tag);
                inputField.value = "";
            }
        }

        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                const tagText = inputField.value.trim();
                if (tagText) addTag(tagText);
            }
        });
    });

    /** FORM RESET */
    form.addEventListener("reset", () => {
        document.querySelectorAll(".tags__tag").forEach(tag => tag.remove());

        gameSearchContainers.forEach(container => {
            if (container.selectedTags) {
                container.selectedTags.clear();
            }
        });
        tagSearchContainers.forEach(container => {
            if (container.selectedTags) {
                container.selectedTags.clear();
            }
        });
        
    });
});
