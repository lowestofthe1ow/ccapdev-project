import markdownit from "markdown-it";
import markdownitclass from "markdown-it-class";

const md = markdownit().use(markdownitclass, {
    img: ["article__image"],
    a: ["article__link"],
});

/**
 * Renders the text input as Markdown with {@link markdownit.render}. Note that the following elements are assigned
 * special classes:
 *
 * - `<img>`: `article__image`
 * - `<a>`: `article__link`
 *
 * @param input - The text input in Markdown
 */
export default (input) => {
    return md.render(input);
};
