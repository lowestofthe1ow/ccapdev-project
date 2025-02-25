import { ObjectId } from "mongodb";

/**
 * Middleware for fetching all threads in the database. Appends a `threads` array to the request object.
 *
 * @param req  - The request object. Must contain the following fields:
 *               - `db`: The database connection
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export async function get_threads(req, res, next) {
    try {
        /* Fetch from database */
        let _threads = req.app.get("db").collection("threads");
        let threads = await _threads
            .aggregate([
                { $sort: { created: -1 } },
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
            ]) /* Sort by most recent post for now. TODO: Pagination */
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        res.locals.threads = threads;
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
        next();
    } catch (error) {
        console.error(error);
    }
}
