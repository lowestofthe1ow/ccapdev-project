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
            maxDepth: 3,
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
        /* Get usernames */
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author_data",
        },
    },
    {
        /* Get usernames for descendants */
        $lookup: {
            from: "users",
            localField: "descendants.author",
            foreignField: "_id",
            as: "descendants.author_data",
        },
    },
    {
        /* "Flattens" author_data field */
        $unwind: {
            path: "$author_data",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        /* TODO: Having to do two separate lookups and unwinds is a bit iffy */
        $unwind: {
            path: "$descendants.author_data",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        /* Regroup the documents by top-level comments */
        $group: {
            _id: "$_id",
            author: { $first: "$author" },
            author_data: { $first: "$author_data" },
            thread: { $first: "$thread" },
            parent: { $first: "$parent" },
            content: { $first: "$content" },
            children: { $first: "$children" },
            vote_count: { $first: "$vote_count" },
            created: { $first: "$created" },
            edited: { $first: "$edited" } /* Date edited */,
            descendants: { $push: "$descendants" },
            deleted: { $first: "$deleted" } /* TODO: Actually delete the data */,
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
 * @param req  - The request object.
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
                            _id: { $in: res.locals.thread.comments },
                        },
                    },
                ].concat(pipeline)
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Append to request object */
        res.locals.comments = comments;
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
                            thread: res.locals.thread._id,
                        },
                    },
                ].concat(pipeline)
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */
        if (comments.length == 0) {
            res.sendStatus(404);
        } else {
            res.locals.comments = comments;
            res.locals.reply = true; /* Displays "Viewing a comment" instead of "Comments (count)" */
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
                    thread: res.locals.thread._id,
                },
            },
            {
                $count: "count",
            },
        ])
        .toArray();

    /* Handle case of empty result */
    if (count.length > 0) {
        res.locals.count = count[0].count;
    } else {
        res.locals.count = 0;
    }

    next();
}
