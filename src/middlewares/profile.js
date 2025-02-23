import { ObjectId } from "mongodb";

export async function get_user(req, res, next) {
    try {
        /* Just get one result for now */
        let _user = req.app.get("db").collection("users").findOne({});
        let user = await _user;

        /* Apply to request object */
        req.app.set("user", user);

        next();
    } catch (error) {
        console.error(error);
    }
}
