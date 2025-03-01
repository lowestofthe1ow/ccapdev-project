import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    if (!req.session.user_id || !req.session.user_id) {
        req.session.destroy(() => {
            res.redirect("/signin");
        });
        return;
    }

    try {
        const user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.user_id),
            });

        if (!user) {
            if (req.session) {
                req.session.destroy();
                return res.redirect("/signin");
            }
        }

        res.locals.user = user; /* Pass to view engine */
        next();
    } catch (error) {
        console.error("Session validation error:", error);
        
        if (req.session) {
            
            req.session.destroy(() => res.redirect("/signin"));
        }

        
    }
};
