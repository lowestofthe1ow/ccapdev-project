/**
 * Helper function that concatenates two strings, for use in Handlebars
 */
export default (...args) => {
    args.pop(); // The last argument is some weird Handlebars thing
    return args.join("");
};
