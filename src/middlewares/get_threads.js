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
        /** If we are planning to add exclude, ggez*/
        const { search, tags = "", games = "", start_date, end_date, author_name, sort } = req.query;
        const _threads = req.app.get("db").collection("threads");

        const parsedTags = tags ? tags.split("|").map(tag => decodeURIComponent(tag).replace(/^#/, "")) : [];
        const parsedGames = games ? games.split("|").map(tag => decodeURIComponent(tag)) : [];

        const notSort = {
            ...(search && { title: { $regex: search, $options: "i" } }),
            ...(parsedTags.length > 0 && { tags: { $in: parsedTags } }),
            ...(parsedGames.length > 0 && { games: { $in: parsedGames } }),
            ...(start_date && { created: { $gte: new Date(start_date) } }),
            ...(end_date && { created: { $lte: new Date(end_date) } }),
            ...(author_name && { author: { $regex: author_name, $options: "i" } }),
        };
        
        const sortOptions = {
            0: { created: -1 },  
            1: { created: 1 },
            2: { vote_count: -1 },
            3: { vote_count: 1 }
        };
        
        const theSort = sortOptions.hasOwnProperty(sort) ? [{ $sort: sortOptions[sort] }] : [{ $sort: { created: -1 } }]; 
        
        const pipeline = [{ $match: notSort }, ...theSort];
        
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
