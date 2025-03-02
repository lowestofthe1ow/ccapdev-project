import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    // If no session exists, just continue (don't redirect)
    if (!req.session?.user_id) {
        return next();
    }

    try {
        // Check if session user is still valid
        const user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.session.user_id),
            });

        if (!user) {
            return req.session.destroy(() => next()); // Remove session but still continue
        }

        res.locals.user = user; // Pass user data to views
    } catch (error) {
        console.error("Session validation error:", error);
        return req.session.destroy(() => next()); // Destroy session on error, but continue
    }

    next();
};
