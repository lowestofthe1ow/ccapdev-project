import { ObjectId } from "mongodb";

function invalid_session(req, res, code) {
    if (req.accepts("html")) {
        /* Redirect to sign-in page if route accessed in browser */
        return req.session.destroy(() => res.redirect("/signin"));
    } else {
        /* Return error message otherwise */
        return res.status(code).json({ success: false, redirectUrl: "/signin", error: "Session error" });
    }
}

export default async (req, res, next) => {
    /* Check if session exists */
    if (!req.session || !req.session.user_id) {
        return invalid_session(req, res, 401);
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
            return invalid_session(req, res, 401);
        }

        res.locals.user = user; /* Pass to view engine */

        next();
    } catch (error) {
        console.error("Session validation error:", error);

        /* If request accepts HTML, redirect to sign-in, otherwise send JSON */
        return invalid_session(req, res, 500);
    }
};
