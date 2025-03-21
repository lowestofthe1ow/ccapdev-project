import TagSearchBox from "/js/tag_search_box.js";

const submission_editor = document.querySelector("#editeditor--thread");

const submission_games = new TagSearchBox(
    document.querySelector("#edit__games") /* TODO: More specific selector */,
    async (query) => {
        const response = await fetch(`/games?q=${encodeURIComponent(query)}`);
        const tags = await response.json();
        return tags;
    },
    true /* Use game tag colors. TODO: Boolean flag kinda unreadable */
);

const submission_tags = new TagSearchBox(
    document.querySelector("#edit__tags") /* TODO: More specific selector */,
    async (query) => {
        const response = await fetch(`/tags?q=${encodeURIComponent(query)}`);
        const tags = await response.json();
        if (query) tags.push(query);
        return tags;
    },
    false /* Use game tag colors. TODO: Boolean flag kinda unreadable */
);

submission_editor.addEventListener("submit", (e) => {
    /* Capture and re-fire */
    e.preventDefault();
    submission_editor["tags"].value = JSON.stringify(submission_tags.selection);
    submission_editor["games"].value = JSON.stringify(submission_games.selection);
    submission_editor.submit();
});
