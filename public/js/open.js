/* Apply to all buttons that "toggle" the visibility of some component */
document.querySelectorAll("[data-toggle]").forEach((x) => {
    x.addEventListener("click", () => {
        /* TODO: Make this settable */
        const toggleClass = x.dataset.toggleClass || "button--current";
        x.classList.toggle(toggleClass);
        /* Apply the "hidden" class */
        document.querySelectorAll(x.dataset.toggle).forEach((x) => {
            x.classList.toggle("hidden");
        });
    });
});
