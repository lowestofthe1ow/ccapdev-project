import SearchBox from "/js/search_box.js";

export default class TagSearchBox extends SearchBox {
    #tag_container;
    #is_game;

    get selection() {
        return Array.from(this.#tag_container.children).map((x) => x.innerText.trim());
    }

    #add(tag) {
        if (!this.selection.includes(tag)) {
            const tag_node = document.createElement("div");

            tag_node.classList.add("tags__tag");
            if (this.#is_game) tag_node.classList.add("tags__tag--game");

            tag_node.textContent = tag;

            tag_node.addEventListener("click", () => {
                tag_node.remove();
            });

            this.#tag_container.appendChild(tag_node);
        }
    }

    clear() {
        this.#tag_container.innerHTML = "";
    }

    constructor(node, loader, is_game) {
        super(node, loader, (selected) => {
            this.#add(selected);
        });

        this.#is_game = is_game; /* TODO: cringe */
        this.#tag_container = this._node.querySelector(".tags");

        /* Hide dropdown when losing focus */
        this._node.querySelector("input").addEventListener("blur", (e) => {
            if (!this._dropdown.node.contains(e.relatedTarget) && this._dropdown.node != e.relatedTarget) {
                this._dropdown.hide();
            }
        });

        this._node.querySelectorAll(".tags__tag").forEach((x) => {
            x.addEventListener("click", () => {
                x.remove();
            });
        });
    }
}
