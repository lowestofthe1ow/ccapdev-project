import { ObjectId } from "mongodb";

export async function get_user(req, res, next) {
    try {
        /* Fetch from database */
        /*
        let _user = req.app.get("db").collection("user");
        let user = await _user
            .aggregate([{ $sort: { id: -1 } }])
            .toArray();
        */

        let _user = req.app.get("db").collection("user").findOne({});
        let user = await _user;

        // {banner: "/img/banner_gkms.jpg", pfp: "/img/pfp.png", username: "lowestofthelow", bio: "weeb"};

        /* Apply to request object */

        req.app.set("user", user);
        /*
        req.app.set("banner", "/img/banner_gkms.jpg");
        req.app.set("pfp", "/img/pfp.png");
        req.app.set("username", _user.username);
        req.app.set("bio", "weeb")
        */
        next();
    } catch (error) {
        console.error(error);
    }
}