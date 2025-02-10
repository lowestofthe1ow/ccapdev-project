/**
 * Middleware for fetching all comments under a thread from the database. Appends a `comments` array to the request object.
 *
 * @param req  - The request object. Must contain the following fields:
 *               - `db`: The database connection
 *               - `thread`: Data for the thread to fetch comments for
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export default async (req, res, next) => {
    try {
        /* Fetch comments from database */
        let _comments = req.app.get("db").collection("comments");
        let comments = await _comments
            .aggregate([
                {
                    /* Fetch all top-level comments under the thread */
                    $match: {
                        _id: { $in: req.app.get("thread").comments },
                    },
                },
                {
                    /* Perform a lookup to fetch all descendants of each comment. */
                    $graphLookup: {
                        as: "replies",
                        connectFromField: "children",
                        connectToField: "_id",
                        depthField: "depth",
                        from: "comments",
                        startWith: "$children",
                    },
                },
                {
                    /* Unwind the descendants array */
                    $unwind: {
                        path: "$replies",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    /* Sort the unwound documents by the replies' creation date */
                    $sort: {
                        "replies.created": -1,
                    },
                },
                {
                    /* Regroup the documents by top-level comments */
                    $group: {
                        _id: "$_id",
                        author: { $first: "$author" },
                        thread: { $first: "$thread" },
                        parent: { $first: "$parent" },
                        content: { $first: "$content" },
                        /* No more use for children field by this point */
                        /* children: { $first: "$children" }, */
                        vote_count: { $first: "$vote_count" },
                        created: { $first: "$created" },
                        replies: { $push: "$replies" },
                    },
                },
                {
                    /* Sort top-level coments by creation date */
                    $sort: {
                        created: -1,
                    },
                },
            ])
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Append to request object */
        req.app.set("comments", comments);
        next();
    } catch (error) {
        console.error(error);
    }
};
