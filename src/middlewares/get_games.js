/** Fetches game data to display in the forum page sidebar (icon, description, logo). Stores it in `res.locals.game_data`. */
export async function get_game_data(req, res, next) {
    try {
        const _games = req.app.get("db").collection("games");
        const games = await _games
            .aggregate([
                {
                    $match: {
                        name: { $in: res.locals.games },
                    },
                },
            ])
            .toArray();

        res.locals.game_data = games;

        next();
    } catch (error) {
        console.error(error);
    }
}

/** Fetches the game data to load into the scrolling banner in the forum page header. Stores it in `res.locals.banners`. */
export async function get_game_banners(req, res, next) {
    try {
        const _games = req.app.get("db").collection("games");
        const games = await _games.aggregate([{ $sample: { size: 5 } }]).toArray();

        res.locals.banners = games;
        next();
    } catch (error) {
        console.error(error);
    }
}

/** Fetches the games to display on the homepage gallery. Stores it in `res.locals.featured`. */
export async function get_featured_games(req, res, next) {
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
}
