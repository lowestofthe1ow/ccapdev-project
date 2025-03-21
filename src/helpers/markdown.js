import markdownit from "markdown-it";

const md = markdownit();

/**
 * Renders the text input as Markdown with {@link markdownit.render}.
 *
 * @param input - The text input in Markdown
 */
export default (input) => {
    return md.render(input);
};
