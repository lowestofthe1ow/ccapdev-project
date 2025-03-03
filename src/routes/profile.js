import express from "express";

/* Helpers */
import check_depth from "../helpers/check_depth.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import markdown from "../helpers/markdown.js";

/* Middleware */
import get_active_user from "../middlewares/get_active_user.js";
import { get_thread_comments } from "../middlewares/get_comments.js";
import { get_threads } from "../middlewares/get_threads.js";

const router = express.Router();

router.get(
    "/",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the current active user */,
    get_threads /* Fetches thread list */,
    (req, res) => {
        res.render("profile", {
            layout: "forum",
            helpers: { format_date },
        });
    }
);

router.get(
    "/comments",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the current active user */,
    (req, res) => {
        res.render("pfcomments", {
            layout: "forum",
            helpers: {
                check_depth,
                check_id,
                concat,
                format_date,
                markdown,
            },
        });
    }
);

router.get(
    "/upvoted",
    get_threads /* TODO: Replace this with session middleware */,
    get_active_user /* Gets the current active user */,
    (req, res) => {
        res.render("pfupvoted", {
            layout: "forum",
            helpers: { format_date },
        });
    }
);

router.get(
    "/edit",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the current active user */,
    (req, res) => {
        res.render("pfedit", {
            layout: "forum"
        });
    }
);

router.post(
    "/edit",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the current active user */,
    async (req, res) => {
        console.log("help");

        let _users = req.app.get("db").collection("users");

        _users.updateOne(
            { _id: res.locals.user._id },
            { $set: { name: req.body.name } },
            { $set: { bio: req.body.bio } }
        );

        res.redirect(`/profile/edit`);
    }
);

export default router;
