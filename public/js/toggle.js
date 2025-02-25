window.addEventListener("load", () => {
    /* Apply to all buttons that "toggle" the visibility of some component */
    this.document.querySelectorAll("[data-toggle]").forEach((x) => {
        x.addEventListener("click", () => {
            /* TODO: Make this settable */
            x.classList.toggle("button--current");
            /* Apply the "hidden" class */
            this.document.querySelectorAll(x.dataset.toggle).forEach((x) => {
                x.classList.toggle("hidden");
            });
        });
    });
});
