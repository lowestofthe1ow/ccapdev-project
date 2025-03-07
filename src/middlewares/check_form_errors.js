import { validationResult } from "express-validator";

/** Sends back express-validator errors if any are encountered */
export default (req, res, next) => {
    const result = validationResult(req);

    /* In case of validation error */
    if (result.errors.length > 0) {
        let msg = result.errors.map((x) => x.msg).join(". ") + ".";
        return res.status(400).json({ success: false, message: msg });
    }

    next();
};
