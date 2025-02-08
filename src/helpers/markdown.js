import markdownit from "markdown-it";

const md = markdownit();

export default (input) => {
    return md.render(input);
};
