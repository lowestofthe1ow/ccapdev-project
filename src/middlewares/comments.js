export default async (req, res, next) => {
    try {
        /* Fetch from database */
        let _comments = req.app.get("db").collection("comments");
        let comments = await _comments
            .aggregate([
                {
                    $match: {
                        _id: { $in: req.app.get("thread").comments },
                    },
                },
                {
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
                    $unwind: {
                        path: "$replies",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        "replies.created": -1,
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        author: { $first: "$author" },
                        parent: { $first: "$parent" },
                        content: { $first: "$content" },
                        children: { $first: "$children" },
                        vote_count: { $first: "$vote_count" },
                        created: { $first: "$created" },
                        replies: { $push: "$replies" },
                    },
                },
                {
                    $sort: {
                        created: -1,
                    },
                },
            ])
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        req.app.set("comments", comments);
        next();
    } catch (error) {
        console.error(error);
    }
};
