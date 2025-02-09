import argon2 from "argon2";

export async function validate_password(req, res, next) {
    try {
        const { password } = req.body;

        if(!password || !req.user){
            return res.json({ success: false, message: "Invalid username or password." });
        }
        
        const validPassword = await argon2.verify(req.user.password, password);

        if (!validPassword) {
            return res.json({ success: false, message: "Invalid user name or password." });
        }

        next(); 
    } catch (error) {
        console.error(error);
    }
}
