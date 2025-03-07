import { ObjectId } from "mongodb";
import { getPaginationNumbers } from "../helpers/pagination.js";

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

export async function get_thread_comments(req, res, next) {
    try {
        /* Fetch comments from database */
        const { page } = req.query;
        const limit = 5;
        const actPage = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
        const skip = (actPage - 1) * limit;
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
                    .concat({
                        $facet: {
                            metadata: [{ $count: "total" }],
                            data: [{ $skip: skip }, { $limit: limit }],
                        },
                    })
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Append to request object */
        const totalComments = comments[0].metadata.length > 0 ? comments[0].metadata[0].total : 0;
        const totalPages = Math.ceil(totalComments / limit); /** Is this floor or ceiling */
        const result = comments[0].data;
        const breadcrumbNumbers = getPaginationNumbers(actPage, totalPages);
        /** MAYBE THERE'S A BETTER WAY, TOMORROW 03/03/2025 - RED WILL SHRINK THIS MFING CODE */
        res.locals.comments = result;
        res.locals.breadcrumb_number = breadcrumbNumbers;
        res.locals.currentPage = actPage;
        res.locals.totalPages = totalPages;
        res.locals.nextPage = actPage + 1;
        res.locals.prevPage = actPage - 1;
        res.locals.showBreadCrumbs = totalComments > limit;
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
            /* Displays "Viewing a comment" instead of "Comments (count)" */
            res.locals.reply = true;

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

export async function get_user_comments(req, res, next) {
    try {
        /* Fetch comments from database */
        const { page } = req.query;
        const limit = 5;
        const actPage = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
        const skip = (actPage - 1) * limit;
        let _comments = req.app.get("db").collection("comments");
        let comments = await _comments
            .aggregate(
                [
                    {
                        $match: {
                            author: new ObjectId(req.params.user_id),
                        },
                    },
                ]
                    .concat(pipeline)
                    .concat({
                        $facet: {
                            metadata: [{ $count: "total" }],
                            data: [{ $skip: skip }, { $limit: limit }],
                        },
                    })
            )
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Append to request object */
        const totalComments = comments[0].metadata.length > 0 ? comments[0].metadata[0].total : 0;
        const totalPages = Math.ceil(totalComments / limit); /** Is this floor or ceiling */
        const result = comments[0].data;
        const breadcrumbNumbers = getPaginationNumbers(actPage, totalPages);
        /** MAYBE THERE'S A BETTER WAY, TOMORROW 03/03/2025 - RED WILL SHRINK THIS MFING CODE */
        res.locals.comments = result;
        res.locals.breadcrumb_number = breadcrumbNumbers;
        res.locals.currentPage = actPage;
        res.locals.totalPages = totalPages;
        res.locals.nextPage = actPage + 1;
        res.locals.prevPage = actPage - 1;
        res.locals.showBreadCrumbs = totalComments > limit;
        next();
    } catch (error) {
        console.error(error);
    }
}
