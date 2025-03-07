import { ObjectId } from "mongodb";
import { paginate, paginate_view } from "../helpers/pagination.js";

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
        /* Add a numerical index to each comment under a certain parent. Used for limiting the # of siblings to show */
        $setWindowFields: {
            partitionBy: {
                depth: "$descendants.depth",
                parent: "$descendants.parent",
            },
            sortBy: {
                "descendants.created": -1,
            },
            output: {
                "descendants.number": {
                    $documentNumber: {},
                },
            },
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
            author: {
                $first: "$author",
            },
            author_data: {
                $first: "$author_data",
            },
            thread: {
                $first: "$thread",
            },
            parent: {
                $first: "$parent",
            },
            content: {
                $first: "$content",
            },
            children: {
                $first: "$children",
            },
            vote_count: {
                $first: "$vote_count",
            },
            created: {
                $first: "$created",
            },
            edited: {
                $first: "$edited",
            } /* Date edited */,
            descendants: {
                $push: "$descendants",
            },
            deleted: {
                $first: "$deleted",
            } /* TODO: Actually delete the data */,
        },
    },
    {
        /* Sort top-level coments by creation date */
        $sort: {
            created: -1,
        },
    },
];

/** Get all comments under a thread */
export async function get_thread_comments(req, res, next) {
    try {
        /* Fetch comments from database */
        const { page } = req.query;
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
                ]
                    .concat(pipeline)
                    .concat(paginate(page, 5))
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        paginate_view(res, comments, page, 5, "comments");
        next();
    } catch (error) {
        console.error(error);
    }
}

/** Get all replies under a comment */
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
            /* Displays "Viewing a comment" instead of "Comments (count)" */
            res.locals.reply = true;

            next();
        }
    } catch (error) {
        console.error(error);
    }
}

/** Get the total number of comments under a thread */
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

/** Get all comments made by a user */
export async function get_user_comments(req, res, next) {
    try {
        /* Fetch comments from database */
        const { page } = req.query;
        let _comments = req.app.get("db").collection("comments");
        let comments = await _comments
            .aggregate([
                /* Get comments by author */
                {
                    $match: {
                        author: new ObjectId(req.params.user_id),
                        deleted: { $ne: true },
                    },
                },
                /* Fetch comment author data */
                {
                    $lookup: {
                        from: "users",
                        localField: "author",
                        foreignField: "_id",
                        as: "author_data",
                    },
                },
                {
                    $unwind: {
                        path: "$author_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                /* Expand thread data */
                {
                    $lookup: {
                        from: "threads",
                        localField: "thread",
                        foreignField: "_id",
                        as: "thread_data",
                    },
                },
                {
                    $unwind: {
                        path: "$thread_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                /* Expand parent comment data (for replies) */
                {
                    $lookup: {
                        from: "comments",
                        localField: "parent",
                        foreignField: "_id",
                        as: "parent_data",
                    },
                },
                {
                    $unwind: {
                        path: "$parent_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                /* Fetch data for author of parent comment (for replies) */
                {
                    $lookup: {
                        from: "users",
                        localField: "parent_data.author",
                        foreignField: "_id",
                        as: "parent_author_data",
                    },
                },
                {
                    $unwind: {
                        path: "$parent_author_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                paginate(page, 10),
            ])
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        paginate_view(res, comments, page, 10, "comments");
        next();
    } catch (error) {
        console.error(error);
    }
}
