const delay = (ms) => new Promise((res) => setTimeout(res, ms));

document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", () => {
        form.querySelectorAll("button[type=submit]").forEach(async (button) => {
            button.disabled = true;
            button.classList.add("button--disabled");
            await delay(5000);
            button.disabled = false;
            button.classList.remove("button--disabled");
        });
    });
});
