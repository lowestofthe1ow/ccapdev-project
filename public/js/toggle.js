window.addEventListener("load", () => {
    /* Apply to all buttons that "toggle" the visibility of some component */
    this.document.querySelectorAll("[data-toggle]").forEach((x) => {
        x.addEventListener("click", () => {
            /* Apply the "hidden" class */
            this.document
                .querySelector(x.dataset.toggle)
                .classList.toggle("hidden");
        });
    });
});
