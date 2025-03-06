export default async (req, res, next) => {
    /* To check if session exists, if not go to sign in*/
    if(req.session.user_id == req.params.user_id) {
        var show_edit = true;
    }
    else {
        var show_edit = false;
    }

    try {
        res.locals.show_edit = show_edit; /* Pass to view engine */
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