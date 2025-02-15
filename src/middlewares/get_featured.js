/**
 * Middleware for fetching the "featured games" to display on the homepage
 *
 * @param req  - The request object. Must contain the following fields:
 *               - `db`: The database connection
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export default async (req, res, next) => {
    try {
        /* Fetch from database */
        let featured_games = req.app.get("db").collection("featured_games");
        let images = await featured_games
            .aggregate([{ $sample: { size: 6 } }]) /* Fetch a sample of 6 documents */
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        req.app.set("featured", [images.slice(0, 3), images.slice(3)] /* Split into a 2x3 grid */);
        next();
    } catch (error) {
        console.error(error);
    }
};
