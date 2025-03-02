export const getGames = async (req, res, next) => {
    try {
        const tags_db = req.app.get("db").collection("featured_games");
        const searchQuery = req.query.q || "";

        const tags = await tags_db.find({ name: { $regex: searchQuery, $options: "i" } }).toArray();

        req.games = tags.map((tag) => tag.name);

        next();
    } catch (error) {
        console.error(error);
    }
};
