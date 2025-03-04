export default async (req, res, next) => {

    const adsCollection = req.app.get("db").collection("ads");
    
    const ads = await adsCollection
        .find({}, { projection: { _id: 0, link: 1 } })
        .toArray();

    res.locals.images = ads; 

    next();
}