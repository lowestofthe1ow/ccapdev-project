import { ObjectId } from "mongodb";

export default async (req, res, next) => {
    if (!req.session.user) {
        if (req.accepts("html")) {
            /** TODO: Change to an error page or something */
            console.log("No user session found ")
            return res.redirect("/signin");
           
        } else {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
    }

    try {
        const user = await req.app.get("db").collection("users").findOne({
            _id: new ObjectId(req.session.user.id),
        });

        if (!user) {
            req.session.destroy();

            if (req.accepts("html")) {
                /** TODO: Change to an error page or something */
                console.log("Here 2");
                return res.redirect("/signin"); 
            } else {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }
        }
        res.locals.user = user;

        next();
    } catch (error) {
        console.error("Session validation error:", error);
        req.session.destroy(() => {
            if (req.accepts("html")) {
                console.log("Here 3");
                res.redirect("/signin");
            } else {
                res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        });
    }
};

