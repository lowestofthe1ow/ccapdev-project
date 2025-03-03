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

    document.querySelectorAll(".editor__options").forEach((editor_options) => {
        Array.from(editor_options.children).forEach((button) => {
            if (button.dataset.type == "formatter") {
                button.addEventListener("click", () => {
                    const id = editor_options.dataset.parentId;
                    var area = document.querySelector("#content--" + id);
                    var text = area.value;
                    var selectedText = text.substring(area.selectionStart, area.selectionEnd);
                    var beforeText = text.substring(0, area.selectionStart);
                    var afterText = text.substring(area.selectionEnd, text.length);
                    area.value = beforeText + button.dataset.open + selectedText + button.dataset.close + afterText;
                    area.focus();
                });
            }
        });
    });

    document.querySelectorAll(".editor__insertimage").forEach((form) => {
        form.querySelector("button").addEventListener("click", () => {
            const url = form.querySelector("input[name='url']").value;
            const alt = form.querySelector("input[name='alt']").value;

            if (form.dataset.type == "image") {
                document.querySelector(form.dataset.target).value += "!";
            }

            document.querySelector(form.dataset.target).value += "[" + alt + "](" + url + ")";
        });
    });
});
