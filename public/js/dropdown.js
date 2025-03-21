export default class Dropdown {
    node;

    render(entries, onSelect) {
        this.node.innerHTML = "";

        if (entries.length == 0) {
            this.hide(); // TODO: use 'hidden' class
        } else {
            entries.forEach((tag) => {
                const option = document.createElement("div");
                option.classList.add("dropdown_item");
                option.textContent = tag;

                option.addEventListener("click", () => {
                    onSelect(tag);
                    this.hide();
                });

                this.node.appendChild(option);
            });

            this.show();
        }
    }

    show() {
        // TODO: use 'hidden' class
        this.node.style.display = "block";
    }

    hide() {
        // TODO: use 'hidden' class
        this.node.style.display = "none";
    }

    constructor(node) {
        this.node = node;
        this.node.tabIndex = -1;
    }
}
