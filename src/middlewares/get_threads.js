import { ObjectId } from "mongodb";

/**
 * Middleware for fetching all threads in the database. Appends a `threads` array to the request object.
 *
 * @param req  - The request object. Must contain the following fields:
 *               - `db`: The database connection
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export const get_threads = async (req, res, next) => {
    try {
        /** tags are tags... i did not make a distinction between tags and games and stuff... yet */
        const { search, tags = [], start_date, end_date, author_name, sort } = req.query;
        const _threads = req.app.get("db").collection("threads");

        
        const pipeline = [
            { $sort: { created: -1 } }, 
            {
                $match: {
                    ...(search && {
                        title: { $regex: search, $options: "i" },
                    }),
                    ...(tags.length > 0 && {
                        tags: { $in: tags },
                    }),
                    ...(start_date && {
                        created: { $gte: new Date(start_date) },
                    }),
                    ...(end_date && {
                        created: { $lte: new Date(end_date) },
                    }),
                    ...(author_name && {
                        author: { $regex: author_name, $options: "i" },
                    }),
                },
            },
            ...(sort && sort === "Newest first"
                ? [{ $sort: { created: -1 } }]
                : sort === "Oldest first"
                ? [{ $sort: { created: 1 } }]
                : sort === "Most popular first"
                ? [{ $sort: { vote_count: -1 } }]
                : sort === "Least popular first"
                ? [{ $sort: { vote_count: 1 } }]
                : []),
        ];
        const threads = await _threads.aggregate(pipeline).toArray();

        req.app.set("threads", threads);
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
        let thread = await _threads.find({ _id: new ObjectId(req.params.thread_id) }).toArray();

        /* Apply to request object */
        req.app.set("thread", thread[0]);
        next();
    } catch (error) {
        console.error(error);
    }
}
