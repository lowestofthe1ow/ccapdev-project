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
    (req, res, next) => {
        req.username = "lowestofthelow";
        next();
    },
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
    (req, res, next) => {
        req.username = "lowestofthelow";
        next();
    },
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
    (req, res, next) => {
        req.username = "lowestofthelow";
        next();
    },
    get_active_user /* Gets the current active user */,
    (req, res) => {
        res.render("pfupvoted", {
            layout: "forum",
            helpers: { format_date },
        });
    }
);

export default router;
