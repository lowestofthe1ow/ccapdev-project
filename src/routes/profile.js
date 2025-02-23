import express from "express";
import { ObjectId } from "mongodb";

/* Middleware */
import { get_user } from "../middlewares/profile.js";

const router = express.Router();

router.get("/", get_user, (req, res) => {
    res.render("profile", {
        user: req.app.get("user")
        /*
        banner: req.app.get("banner"),
        pfp: req.app.get("pfp"),
        username: req.app.get("username"),
        bio: req.app.get("bio")
        */
    });
});

export default router;