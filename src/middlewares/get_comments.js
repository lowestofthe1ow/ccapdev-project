import { ObjectId } from "mongodb";

const pipeline = [
    {
        /* Perform a lookup to fetch all descendants of each comment. */
        $graphLookup: {
            as: "descendants",
            connectFromField: "children",
            connectToField: "_id",
            depthField: "depth",
            from: "comments",
            startWith: "$children",
            maxDepth: 5,
        },
    },
    {
        /* Unwind the descendants array */
        $unwind: {
            path: "$descendants",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        /* Sort the unwound documents by the replies' creation date */
        $sort: {
            "descendants.created": -1,
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
            children: { $first: "$children" },
            vote_count: { $first: "$vote_count" },
            created: { $first: "$created" },
            descendants: { $push: "$descendants" },
        },
    },
    {
        /* Sort top-level coments by creation date */
        $sort: {
            created: -1,
        },
    },
];

/**
 * Middleware for fetching all comments under a thread from the database. Appends a `comments` array to the request object.
 *
 * @param req  - The request object. Must contain the following fields:
 *               - `db`: The database connection
 *               - `thread`: Data for the thread to fetch comments for
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export async function get_thread_comments(req, res, next) {
    try {
        /* Fetch comments from database */
        let _comments = req.app.get("db").collection("comments");
        let comments = await _comments
            .aggregate(
                [
                    {
                        /* Fetch all top-level comments under the thread */
                        $match: {
                            _id: { $in: req.app.get("thread").comments },
                        },
                    },
                ].concat(pipeline)
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Append to request object */
        req.app.set("comments", comments);
        next();
    } catch (error) {
        console.error(error);
    }
}

export async function get_comment_replies(req, res, next) {
    try {
        /* Fetch comments from database */
        let _comments = req.app.get("db").collection("comments");

        let comments = await _comments
            .aggregate(
                [
                    {
                        /* Fetch all top-level comments under the thread */
                        $match: {
                            _id: new ObjectId(req.params.comment_id),
                            thread: req.app.get("thread")._id,
                        },
                    },
                ].concat(pipeline)
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */
        if (comments.length == 0) {
            res.sendStatus(404);
        } else {
            req.app.set("comments", comments);
            next();
        }
    } catch (error) {
        console.error(error);
    }
}

export async function get_comment_count(req, res, next) {
    let _comments = req.app.get("db").collection("comments");
    let count = await _comments
        .aggregate([
            {
                /* Fetch all comments under a thread */
                $match: {
                    thread: req.app.get("thread")._id,
                },
            },
            {
                $count: "count",
            },
        ])
        .toArray();

    /* Handle case of empty result */
    if (count.length > 0) {
        req.app.set("count", count[0].count);
    } else {
        req.app.set("count", 0);
    }

    next();
}
