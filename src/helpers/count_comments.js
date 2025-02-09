/**
 * Counts the number of comments for a given thread.
 *
 * @param comments - The array of comment documents returned by the query to the MongoDB database. Each top-level
 *                   comment has a replies field holding an array of all of that comment's descendants
 */
export default (comments) => {
    let total = 0;

    comments.forEach((x) => {
        /* Count the top-level comment plus all of its descendants */
        total += 1 + x.replies.length;
    });

    return total;
};
