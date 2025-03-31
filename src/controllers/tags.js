export default async (req, res) => {
    try {
        const tags_db = req.app.get("db").collection("threads");
        const searchQuery = req.query.q || "";

        const tags = await tags_db
            .aggregate([
                {
                    $unwind: "$tags",
                },
                {
                    $match: {
                        tags: {
                            $regex: searchQuery,
                            $options: "i",
                        },
                        deleted: { $ne: true },
                    },
                },
                {
                    $group: {
                        _id: "$tags",
                        tag: {
                            $first: "$tags",
                        },
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        tag: 1,
                        count: 1,
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
            ])
            .toArray();

        req.games = res.json(tags.map((tag) => tag.tag));
    } catch (error) {
        console.error(error);
    }
};
