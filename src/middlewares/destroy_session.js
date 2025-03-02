export default (req, res, next) => {
    if (!req.session) {
        return next();
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to destroy session." });
        }
        res.clearCookie("connect.sid");
        next();
    });
};