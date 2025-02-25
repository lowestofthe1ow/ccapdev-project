import { validationResult } from "express-validator";

export default async (req, res, next) => {
    const result = validationResult(req);

    /* In case of validation error */
    if (result.errors.length > 0) {
        let msg = result.errors.map((x) => x.msg).join(". ") + ".";
        return res.status(400).json({ success: false, message: msg });
    } 
    console.log(req.body.found_user);
    if (req.body.found_user) {
        req.session.user = {
            id: req.body.found_user._id,
            name: req.body.found_user.name,
        };
        console.log(req.session.user)
        return next();
        
    }


    return res.status(400).json({ success: false, message: "User authentication failed." });
       
};
