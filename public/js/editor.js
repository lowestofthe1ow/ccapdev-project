/* TODO: Clean up because this is ugly */
window.addEventListener("load", () => {
    /* Apply to all buttons that "toggle" the visibility of some component */
    this.document.querySelectorAll(".editor__previewbutton").forEach((x) => {
        x.addEventListener("click", () => {
            /* Apply the "hidden" class */
            let editor = this.document.querySelector(x.parentNode.dataset.editor);
            let options = this.document.querySelector(x.parentNode.dataset.options);
            let preview = this.document.querySelector(x.parentNode.dataset.preview);
            preview.firstElementChild.innerHTML = window.markdownit().render(editor.value);

            options.classList.add("hidden");
            editor.classList.add("hidden");
            preview.classList.remove("hidden");
            x.classList.add("button--current");
            x.previousElementSibling.classList.remove("button--current");
        });
    });

    this.document.querySelectorAll(".editor__editbutton").forEach((x) => {
        x.addEventListener("click", () => {
            /* Apply the "hidden" class */
            let editor = this.document.querySelector(x.parentNode.dataset.editor);
            let options = this.document.querySelector(x.parentNode.dataset.options);
            let preview = this.document.querySelector(x.parentNode.dataset.preview);

            options.classList.remove("hidden");
            editor.classList.remove("hidden");
            preview.classList.add("hidden");

            x.classList.add("button--current");
            x.nextElementSibling.classList.remove("button--current");
        });
    });
});
