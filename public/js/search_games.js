import TagSearchBox from "/js/tag_search_box.js";

const form = document.querySelector(".advsearch");

/* Create new instance of TagSearchBox from the game search box on the page */
const game_search = new TagSearchBox(
    document.querySelector(".game__search") /* TODO: More specific selector */,
    async (query) => {
        const response = await fetch(`/games?q=${encodeURIComponent(query)}`);
        const tags = await response.json();
        return tags;
    },
    true /* Use game tag colors. TODO: Boolean flag kinda unreadable */
);

/* Create new instance of TagSearchBox from the tag search box on the page */
const tag_search = new TagSearchBox(
    document.querySelector(".tag__search") /* TODO: More specific selector */,
    async (query) => {
        /* TODO: Get suggested tags */
        const response = await fetch(`/tags?q=${encodeURIComponent(query)}`);
        const tags = await response.json();
        if (query) tags.push(query);
        return tags;
    },
    false /* Use normal tag colors. TODO: Boolean flag kinda unreadable */
);

/* TODO: Was too lazy to change stuff here, so it stays but moved from the other file */
document.querySelector(".search").addEventListener("submit", (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = document.querySelector(".search").querySelector("input[name='search']").value.trim();

    searchQuery ? urlParams.set("search", searchQuery) : urlParams.delete("search");

    if (!form.classList.contains("hidden")) {
        ["start_date", "end_date", "sort", "author_name"].forEach((param) => {
            const value = form.querySelector(`[name="${param}"]`)?.value.trim();
            value ? urlParams.set(param, value) : urlParams.delete(param);
        });

        const sortField = form.querySelector("select[name='sort']");
        const selectedIndex = sortField?.selectedIndex ?? 0;
        selectedIndex > 0 ? urlParams.set("sort", selectedIndex.toString()) : urlParams.delete("sort");

        urlParams.delete("games");

        const gameTags = game_search.selection.join("|");
        if (gameTags) {
            urlParams.set("games", gameTags);
        }

        urlParams.delete("tags");
        const tags = tag_search.selection.join("|");
        if (tags) {
            urlParams.set("tags", tags);
        }
    } else {
        ["start_date", "end_date", "sort", "author_name", "games", "tags"].forEach((param) => urlParams.delete(param));
    }
    window.location.href = `/threads?${urlParams.toString()}`;
});

form.addEventListener("reset", () => {
    game_search.clear();
    tag_search.clear();
});
