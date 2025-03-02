import { ObjectId } from "mongodb";

export default async (req, res, next) => {

    /* To check if session exists, if not go to sign in*/
    if (!req.session) {
        return res.redirect("/signin");
    }
    
    try {
        /* Check if the data stored in session is still valid */
        const user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.user_id),
            });
        
        if (!user) {
            return req.session.destroy(() => res.redirect("/signin"));
        }
        res.locals.user = user; /* Pass to view engine */
        next();
    } catch (error) {
        console.error("Session validation error:", error);
        
        return req.session.destroy(() => res.redirect("/signin"));

    }
};
