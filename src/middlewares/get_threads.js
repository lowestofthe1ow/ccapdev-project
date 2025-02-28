import { ObjectId } from "mongodb";

/**
 * Middleware for fetching all threads in the database. Appends a `threads` array to the request object.
 *
 * @param req  - The request object.
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export const get_threads = async (req, res, next) => {
    try {
        /** If we are planning to add exclude, ggez*/
        const { search, tags = "", games = "", start_date, end_date, author_name, sort } = req.query;
        const _threads = req.app.get("db").collection("threads");

        const parsedTags = tags ? tags.split("|").map((tag) => decodeURIComponent(tag).replace(/^#/, "")) : [];
        const parsedGames = games ? games.split("|").map((tag) => decodeURIComponent(tag)) : [];

        /**TODO: Get timezone from client and use that to offset a THIS somehow  */
        const localToUTC = (date, hours, minutes, seconds, milliseconds) => {
            if (!date) return null;

            let newDate = new Date(date);
            newDate.setHours(hours, minutes, seconds, milliseconds);

            return newDate;
        };

        const adjustedStartDate = localToUTC(start_date, 0, 0, 0, 0);
        const adjustedEndDate = localToUTC(end_date, 23, 59, 59, 999);

        const notSort = {
            ...(search && {
                $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }],
            }),
            ...(parsedTags.length && { tags: { $in: parsedTags } }),
            ...(parsedGames.length && { games: { $in: parsedGames } }),
            ...(adjustedStartDate && { created: { $gte: adjustedStartDate } }),
            ...(adjustedEndDate && { created: { $lte: adjustedEndDate } }),
            ...(adjustedStartDate &&
                adjustedEndDate && { created: { $gte: adjustedStartDate, $lte: adjustedEndDate } }),
            ...(author_name && { "author.name": { $regex: author_name, $options: "i" } }),
        };

        const sortOptions = {
            0: { created: -1 },
            1: { created: 1 },
            2: { vote_count: -1 },
            3: { vote_count: 1 },
        };

        const theSort = sortOptions.hasOwnProperty(sort)
            ? [{ $sort: sortOptions[sort] }]
            : [{ $sort: { created: -1 } }];

        const pipeline = [
            { $match: { ...notSort, deleted: { $ne: true } } }, // Hide deleted posts from results
            ...theSort,
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
        ];
        /* TODO: Pagination */
        const threads = await _threads.aggregate(pipeline).toArray();

        res.locals.threads = threads;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

/**
 * Middleware for fetching a specific thread in the database. Appends a `thread` object to the request object.
 *
 * @param req  - The request object. Must contain the following fields and parameters:
 *               - `db`: The database connection
 *               - `id`: The ID of the thread (part of the route as `/threads/:id`)
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export async function get_thread(req, res, next) {
    try {
        /* Fetch from database */
        let _threads = req.app.get("db").collection("threads");
        let thread = await _threads
            .aggregate([
                { $match: { _id: new ObjectId(req.params.thread_id) } },
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
                    $unwind: {
                        path: "$author_data",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .toArray();

        /* Apply to request object */
        res.locals.thread = thread[0];
        next();
    } catch (error) {
        console.error(error);
    }
}
