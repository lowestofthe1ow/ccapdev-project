export default async (req, res) => {
    if (req.body.found_user) {
        req.session.user_id = req.body.found_user._id;
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21;
            req.session.rememberMe = true;
        }
        res.json({ success: true, redirectUrl: "/threads" });
    } else {
        res.status(400).json({ success: false, message: "User authentication failed." });
    }
};
