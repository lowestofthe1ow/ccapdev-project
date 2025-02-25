import express from "express";

/* Helpers */
import format_date from "../helpers/format_date.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import markdown from "../helpers/markdown.js";

/* Middleware */
import get_active_user from "../middlewares/get_active_user.js";
import { get_threads } from "../middlewares/get_threads.js";
import { get_thread_comments } from "../middlewares/get_comments.js";

const router = express.Router();

router.get(
    "/",
    /* TODO: Replace this with session middleware */
    (req, res, next) => {
        req.username = "lowestofthelow";
        next();
    },
    get_active_user /* Gets the current active user */,
    get_threads /* Fetches thread list */,
    (req, res) => {
        res.render("profile", {
            layout: "forum",
            threads: req.app.get("threads"),
            helpers: { format_date },
        });
    }
);

router.get("/comments", get_thread_comments, get_user, (req, res) => {
    res.render("pfcomments", {
        user: req.app.get("user"),
        layout: "forum",
        threads: req.app.get("threads"),
        comments: req.app.get("comments"),
        helpers: {
            check_depth(depth) {
                return depth >= 3;
            },
            check_id,
            concat,
            format_date,
            markdown,
        }
    });
});

router.get("/upvoted", get_threads, get_user, (req, res) => {
    res.render("pfupvoted", {
        user: req.app.get("user"),
        layout: "forum",
        threads: req.app.get("threads"),
        helpers: { format_date },
    });
});

export default router;
