export default async (req, res, next) => {
    try {
        /* Fetch from database */
        let featured_games = req.app.get("db").collection("featured_games");
        let images = await featured_games
            .aggregate([{ $sample: { size: 6 } }])
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        req.app.set("featured", [images.slice(0, 3), images.slice(3)]);
        next();
    } catch (error) {
        console.error(error);
    }
};
