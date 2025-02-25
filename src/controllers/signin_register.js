import { validationResult } from "express-validator";

export default async (req, res) => {
    const result = validationResult(req);

    /* In case of validation error */
    if (result.errors.length > 0) {
        let msg = result.errors.map((x) => x.msg).join(". ") + ".";
        res.status(400).json({ success: false, message: msg });
    } else {
        /* Validation success */
        try {
            const { name } = req.body;
            const users = req.app.get("db").collection("users");

            await users.insertOne({ name, password: res.locals.hashed });

            res.json({ success: true, redirectUrl: "/threads" });
        } catch (error) {
            console.error(error);
        }
    }
};
