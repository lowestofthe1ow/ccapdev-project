import argon2 from "argon2";

export default async (req, res, next) => {
    try {
        /* TODO: Is putting the hashed password in res.locals bad lmao */
        res.locals.hashed = await argon2.hash(req.body.password);

        next();
    } catch (error) {
        console.error(error);
    }
};
