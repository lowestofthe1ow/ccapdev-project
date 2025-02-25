import argon2 from "argon2";

export async function validate_password(req, res, next) {
    try {
        const { password } = req.body;
        const user = req.app.get("user");
        console.log(user);

        if (!password || !user) {
            return res.json({ success: false, message: "Invalid username or password." });
        }

        const validPassword = await argon2.verify(user.password, password);

        if (!validPassword) {
            return res.json({ success: false, message: "Invalid username or password." });
        }

        next();
    } catch (error) {
        console.error(error);
    }
}
