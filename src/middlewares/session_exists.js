export default async (req, res, next) => {
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
};
