window.addEventListener("load", () => {
    /* Apply to all buttons that "toggle" the visibility of some component */
    this.document.querySelectorAll("[data-toggle]").forEach((x) => {
        x.addEventListener("click", () => {
            /* TODO: Make this settable */
            const toggleClass = x.dataset.toggleClass || "button--current";
            x.classList.toggle(toggleClass);
            /* Apply the "hidden" class */
            this.document.querySelectorAll(x.dataset.toggle).forEach((x) => {
                x.classList.toggle("hidden");
            });
        });
    });
});
