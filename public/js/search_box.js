import Dropdown from "/js/dropdown.js";

export default class SearchBox {
    _dropdown;
    _node;

    get value() {
        /* TODO: Better selector */
        return this._node.querySelector("input").value.trim();
    }

    constructor(node, loader, onSelect) {
        this._node = node;
        this._dropdown = new Dropdown(node.querySelector(".dropdown"));

        let debounceTimer;

        ["input", "click"].forEach((event) => {
            /* TODO: Better selector */
            node.querySelector("input").addEventListener(event, async () => {
                clearTimeout(debounceTimer);

                debounceTimer = setTimeout(async () => {
                    const tags = await loader(this.value);
                    this._dropdown.render(tags, (selected) => {
                        onSelect(selected);
                        this._node.querySelector("input").value = "";
                    });
                }, 200);
            });
        });
    }
}
