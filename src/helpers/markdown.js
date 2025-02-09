import markdownit from "markdown-it";
import markdownitclass from "markdown-it-class";

const md = markdownit().use(markdownitclass, {
    img: ["article__image"],
    a: ["article__link"],
});

export default (input) => {
    return md.render(input);
};
