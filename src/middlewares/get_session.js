import { ObjectId } from "mongodb";

/**
 * Redirects invalid sessions to the sign-in page, or responds with a JSON error object.
 * @param {number} status_code The status code to set the JSON response to
 */
function redirect_invalid_session(req, res, status_code) {
    if (req.accepts("html")) {
        /* Redirect to sign-in page if route accessed in browser */
        return req.session.destroy(() => res.redirect("/signin"));
    } else {
        /* Return error message otherwise */
        return res.status(status_code).json({ success: false, redirectUrl: "/signin", error: "Session error" });
    }
}

/**
 * Checks if a valid session exists and stores user data for that session in `res.locals.user`.
 * @param {Function} if_invalid The callback to execute in case of an invalid session
 */
async function get_session(req, res, next, if_invalid) {
    if (!req.session?.user_id) {
        return if_invalid();
    }

    /* If session exists, validate user ID first */
    try {
        /* Check if the data stored in session is still valid */
        const user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.user_id),
            });

        if (!user) {
            return if_invalid();
        }

        if(user.deleted){
            return if_invalid();
        }

        res.locals.user = user; /* Pass to view engine */
        next();
    } catch (error) {
        console.error("Session validation error:", error);

        /* If request accepts HTML, redirect to sign-in, otherwise send JSON */
        return if_invalid();
    }
}

/**
 * Gets the active user from a session. On success, user data is stored into `res.locals.user`. On failure, user is
 * redirected to the sign-in page.
 */
export async function get_active_user(req, res, next) {
    /* Check if session exists */
    get_session(req, res, next, () => {
        /* If no session, redirect */
        return redirect_invalid_session(req, res, 401);
    });
}

/**
 * Gets the active user from a session. On success, user data is stored into `res.locals.user`. On failure, user is
 * allowed through with a guest session.
 */
export async function allow_guest_session(req, res, next) {
    /* Check if session exists */
    get_session(req, res, next, () => {
        /* If no session, go through */
        return req.session.destroy(() => next());
    });
}

/** Redirects to forum page if session exists. Used to bypass sign-in/register for already logged-in users. */
export function check_existing_session(req, res, next) {
    /* If session exists, redirect directly to forum page */
    if (req.session?.user_id) {
        if (req.accepts("html")) {
            return res.redirect("/threads");
        } else {
            return res.json({
                success: false,
                message: "Session already exists. Redirecting to /threads",
                sessionExists: true,
                redirectUrl: "/threads",
            });
        }
    }

    next();
}
