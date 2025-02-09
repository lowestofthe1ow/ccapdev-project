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
                        from: "comments",
                        startWith: "$children",
                        connectFromField: "children",
                        connectToField: "_id",
                        as: "replies",
                        depthField: "depth",
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
