import { validationResult } from "express-validator";

export default async (req, res, next) => {
    const result = validationResult(req);

    /* In case of validation error */
    if (result.errors.length > 0) {
        let msg = result.errors.map((x) => x.msg).join(". ") + ".";
        res.status(400).json({ success: false, message: msg });
    } else {
        next();
    }
};
