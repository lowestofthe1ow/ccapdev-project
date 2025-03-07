export default async (req, res, next) => {
    const _games = req.app.get("db").collection("games");

    const games = await _games.aggregate([{ $sample: { size: 5 } }]).toArray();

    res.locals.banners = games;

    next();
};
