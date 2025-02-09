import argon2 from "argon2";

export async function hash_password(req, res, next) {
    try {
        const { password, confirm } = req.body;

        if (req.user) {
            return res.json({ success: false, message: "Username is already taken." });
        }

        if (!password || !confirm) {
            return res.json({ success: false, message: "Password fields are required." });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long." });
        }

        if (password !== confirm) {
            return res.json({ success: false, message: "Passwords do not match." });
        }

        req.hashedPassword = await argon2.hash(password);

        next(); 
    } catch (error) {
        console.error(error);
    }
}


