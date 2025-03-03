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
        const { search, tags = "", games = "", start_date, end_date, author_name, sort, page } = req.query;
        const _threads = req.app.get("db").collection("threads");

        console.log(req.query);

        if (tags || games || start_date || end_date || author_name || sort) {
            res.locals.show_search = true;
        }

        res.locals.search = search;
        res.locals.start_date = start_date;
        res.locals.end_date = end_date;
        res.locals.author = author_name;
        res.locals.sort = [false, false, false, false];
        res.locals.sort[sort ? sort : 0] = true;

        const parsedTags = tags ? tags.split("|").map((tag) => decodeURIComponent(tag).replace(/^#/, "")) : [];
        const parsedGames = games ? games.split("|").map((tag) => decodeURIComponent(tag)) : [];
        res.locals.tags = parsedTags;
        res.locals.games = parsedGames;
        const actPage = !page || isNaN(parseInt(page)) ? 1 : Math.max(1, parseInt(page));
        const limit = 10; /* TODO IMPORTANT: CHANGE THIS TO 10 OR SOMETHING */
        const skip = (actPage - 1) * limit;

        /**TODO: Get timezone from client and use that to offset a THIS somehow  */
        const localToUTC = (date, hours, minutes, seconds, milliseconds) => {
            if (!date) return null;

            let newDate = new Date(date);
            newDate.setHours(hours, minutes, seconds, milliseconds);

            return newDate;
        };

        const adjustedStartDate = localToUTC(start_date, 0, 0, 0, 0);
        const adjustedEndDate = localToUTC(end_date, 23, 59, 59, 999);
        /**TODO: author name is id now, change it somehow */
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
            ...(author_name && { "author_data.name": { $regex: author_name, $options: "i" } }),
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
            { $match: { ...notSort, deleted: { $ne: true } } }, // Hide deleted posts from results
            ...theSort,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: limit }],
                },
            },
        ];
        /* TODO: Pagination */

        function getPaginationNumbers(page, totalPages) {
            page = parseInt(page, 10);
            totalPages = parseInt(totalPages, 10);
            const pagination = [];

            if (totalPages <= 7) {
                // If there are 7 or fewer pages, show all
                for (let i = 1; i <= totalPages; i++) {
                    pagination.push({ number: i, isCurrent: i === page });
                }
            } else if (page <= 4) {
                // When on the first few pages: show first 5, "...", last
                for (let i = 1; i <= 5; i++) {
                    pagination.push({ number: i, isCurrent: i === page });
                }
                pagination.push({ number: "...", isDots: true });
                pagination.push({ number: totalPages, isCurrent: page === totalPages });
            } else if (page >= totalPages - 3) {
                // When on the last few pages: show first, "...", last 5
                pagination.push({ number: 1, isCurrent: page === 1 });
                pagination.push({ number: "...", isDots: true });
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pagination.push({ number: i, isCurrent: i === page });
                }
            } else {
                pagination.push({ number: 1, isCurrent: page === 1 });

                let startPage = Math.max(2, page - 1);
                let endPage = Math.min(totalPages - 1, page + 1);

                if (startPage > 2) {
                    pagination.push({ number: "...", isDots: true });
                }

                for (let i = startPage; i <= endPage; i++) {
                    pagination.push({ number: i, isCurrent: i === page });
                }

                if (endPage < totalPages - 1) {
                    pagination.push({ number: "...", isDots: true });
                }

                pagination.push({ number: totalPages, isCurrent: page === totalPages });
            }

            return pagination;
        }

        const result = await _threads.aggregate(pipeline).toArray();

        const totalThreads = result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;
        const totalPages = Math.ceil(totalThreads / limit); /** Is this floor or ceiling */
        const threads = result[0].data;
        const breadcrumbNumbers = getPaginationNumbers(actPage, totalPages);
        /** MAYBE THERE'S A BETTER WAY, TOMORROW 03/03/2025 - RED WILL SHRINK THIS MFING CODE */
        res.locals.threads = threads;
        res.locals.breadcrumb_number = breadcrumbNumbers;
        res.locals.currentPage = actPage;
        res.locals.totalPages = totalPages;
        res.locals.nextPage = actPage + 1;
        res.locals.prevPage = actPage - 1;

        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export async function get_top_threads(req, res, next) {
    try {
        let _threads = req.app.get("db").collection("threads");
        let threads = await _threads
            .aggregate([
                {
                    $match: {
                        created: {
                            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                        },
                        deleted: {
                            $ne: true,
                        },
                    },
                },
                {
                    $sort: {
                        vote_count: -1,
                        created: -1,
                    },
                },
                {
                    $limit: 5,
                },
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
            ])
            .toArray();

        res.locals.top_threads = threads;
        next();
    } catch (error) {
        console.error(error);
    }
}

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
        res.locals.games = thread[0].games;
        next();
    } catch (error) {
        console.error(error);
    }
}
