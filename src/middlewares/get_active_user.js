import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    /* To check if session exists, if not go to sign in*/
    if (!req.session || !req.session.user_id) {
        if (req.accepts("html")) {
            return req.session.destroy(() => res.redirect("/signin"));
        } else {
            return res.status(401).json({ success: false, redirectUrl: "/signin", error: "Session has expired" });
        }
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
            /* If request accepts HTML, redirect to sign-in, otherwise send JSON */
            if (req.accepts("html")) {
                return req.session.destroy(() => res.redirect("/signin"));
            } else {
                return res.status(401).json({ success: false, redirectUrl: "/signin", error: "Unauthorized" });
            }
        }

        res.locals.user = user; /* Pass to view engine */
        next();
    } catch (error) {
        console.error("Session validation error:", error);

        /* If request accepts HTML, redirect to sign-in, otherwise send JSON */
        if (req.accepts("html")) {
            return req.session.destroy(() => res.redirect("/signin"));
        } else {
            return res.status(500).json({success: false, redirectUrl: "/signin",  error: "Internal Server Error" });
        }
    }
};
