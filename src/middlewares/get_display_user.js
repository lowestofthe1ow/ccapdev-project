import { ObjectId } from "mongodb";

/** Gets user data to display on a profile page */
export default async (req, res, next) => {
    try {
        res.locals.display_user = await req.app
            .get("db")
            .collection("users")
            .findOne({
                _id: new ObjectId(req.params.user_id),
            });

        next();
    } catch (error) {
        console.error(error);
    }
};
