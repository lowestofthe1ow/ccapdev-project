import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect("/signin");
    }

    try {
        const user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.user_id),
            });

        if (!user) {
            req.session.destroy();
            res.redirect("/signin");
        }

        res.locals.user = user; /* Pass to view engine */
        next();
    } catch (error) {
        console.error("Session validation error:", error);

        req.session.destroy(() => {
            res.redirect("/signin");
        });
    }
};
