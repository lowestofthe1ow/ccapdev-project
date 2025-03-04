export default async (req, res, next) => {
    const adsCollection = req.app.get("db").collection("featured_games");

    const ads = await adsCollection.aggregate([{ $sample: { size: 5 } }]).toArray();

    res.locals.images = ads;

    next();
};
