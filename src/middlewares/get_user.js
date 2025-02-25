import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    try {
        /* Just get one result for now */
        let _user = req.app
            .get("db")
            .collection("users")
            .findOne({
                name: req.app.get("username"),
            });
        let user = await _user;

        /* Apply to request object */
        req.app.set("user", user); // TODO
        res.locals.user = user;

        next();
    } catch (error) {
        console.error(error);
    }
};
