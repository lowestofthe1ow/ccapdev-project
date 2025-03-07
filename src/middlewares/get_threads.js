import { ObjectId } from "mongodb";

import { paginate, paginate_view } from "../helpers/pagination.js";

/**
 * {@returns a {@link Date} in UTC}
 * @param {*} date - A valid {@link DateConstructor}
 * @param {*} hours - Sets the hours for the time portion of the new date
 * @param {*} minutes - Sets the minutes for the time portion of the new date
 * @param {*} seconds - Sets the seconds for the time portion of the new date
 * @param {*} milliseconds - Sets the milliseconds for the time portion of the new date
 */
function as_UTC(date, hours, minutes, seconds, milliseconds) {
    if (!date) return null;

    let new_date = new Date(date);
    new_date.setHours(hours, minutes, seconds, milliseconds);

    return new_date;
}

function _sort(sort) {
    const sort_options = {
        0: { created: -1 },
        1: { created: 1 },
        2: { vote_count: -1 },
        3: { vote_count: 1 },
    };

    return sort_options.hasOwnProperty(sort) ? { $sort: sort_options[sort] } : { $sort: { created: -1 } };
}

/** Gets a list of threads given search filters. */
export async function get_threads(req, res, next) {
    try {
        const _threads = req.app.get("db").collection("threads");

        /* Destructure query object and pass some parameters to view immediately */
        const { search, tags = "", games = "", start_date, end_date, author, sort = 0, page } = req.query;
        res.locals = { ...res.locals, ...{ search, start_date, end_date, author } };
        res.locals.sort = parseInt(sort); /* Sort field should be parsed as numeric first */

        res.locals.show_search = tags || games || start_date || end_date || author || sort;

        /* Parse the tags and games fields into arrays */
        const parsed_tags = tags ? tags.split("|").map((tag) => decodeURIComponent(tag).replace(/^#/, "")) : [];
        const parsed_games = games ? games.split("|").map((tag) => decodeURIComponent(tag)) : [];
        res.locals.tags = parsed_tags;
        res.locals.games = parsed_games;

        const start_date_UTC = as_UTC(start_date, 0, 0, 0, 0);
        const end_date_UTC = as_UTC(end_date, 23, 59, 59, 999);

        /* Construct the search filters object to pass to MongoDB $match */
        const search_filters = {
            ...(search && {
                $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }],
            }),
            ...(parsed_tags.length && { tags: { $in: parsed_tags } }),
            ...(parsed_games.length && { games: { $in: parsed_games } }),
            ...(start_date_UTC && { created: { $gte: start_date_UTC } }),
            ...(end_date_UTC && { created: { $lte: end_date_UTC } }),
            ...(start_date_UTC && end_date_UTC && { created: { $gte: start_date_UTC, $lte: end_date_UTC } }),
            ...(author && { "author_data.name": { $regex: author, $options: "i" } }),
            deleted: { $ne: true },
        };

        const result = await _threads
            .aggregate([
                { $match: search_filters },
                _sort(sort),
                /* Expand author data */
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
                /* Pagination */
                paginate(page, 10),
            ])
            .toArray();

        paginate_view(res, result, page, 10);

        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/** Gets a list of top threads (for sidebar) */
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

/** Gets data on a specific thread */
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

        /* Passes the games associated with the thread to the view. Used for sidebar */
        res.locals.games = thread[0].games;
        next();
    } catch (error) {
        console.error(error);
    }
}

/** Gets a list of all threads made by a user. */
export async function get_user_threads(req, res, next) {
    try {
        const { sort, page } = req.query;
        const _threads = req.app.get("db").collection("threads");

        const result = await _threads
            .aggregate([
                { $match: { deleted: { $ne: true }, author: new ObjectId(req.params.user_id) } },
                _sort(sort),
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
                paginate(page, 10),
            ])
            .toArray();

        paginate_view(res, result, page, 10);

        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
}

/** Gets a list of all threads upvoted by a user. */
export const get_upvoted_threads = async (req, res, next) => {
    try {
        const { sort, page } = req.query;
        const _threads = req.app.get("db").collection("threads");

        const user_thread_vote_list = await req.app
            .get("db")
            .collection("users")
            .findOne({ _id: new ObjectId(req.params.user_id) }, { projection: { thread_vote_list: 1 } });

        const upvoted_ids = Object.keys(user_thread_vote_list.thread_vote_list)
            .filter((threadId) => user_thread_vote_list.thread_vote_list[threadId] === 1)
            .map((threadId) => new ObjectId(threadId));

        const result = await _threads
            .aggregate([{ $match: { _id: { $in: upvoted_ids } } }, _sort(sort), paginate(page, 10)])
            .toArray();

        paginate_view(res, result, page, 10);

        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};
