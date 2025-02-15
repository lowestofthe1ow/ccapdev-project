export async function find_user(req, res, next) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Invalid username or password." });
        }

        /* Fetch from database */
        let users = req.app.get("db").collection("users");
        const existingUser = await users.findOne({ name });

        req.app.set("user", existingUser);

        next();
    } catch (error) {
        console.error(error);
    }
}
