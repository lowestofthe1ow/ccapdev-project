/**
 * Middleware for fetching the "featured games" to display on the homepage
 *
 * @param req  - The request object.
 * @param res  - The response object.
 * @param next - Calls the next function in the middleware chain.
 */
export default async (req, res, next) => {
    try {
        /* Fetch from database */
        let games = req.app.get("db").collection("games");
        let images = await games
            .aggregate([{ $sample: { size: 6 } }]) /* Fetch a sample of 6 documents */
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        res.locals.featured = [images.slice(0, 3), images.slice(3)]; /* Split into a 2x3 grid */
        next();
    } catch (error) {
        console.error(error);
    }
};
