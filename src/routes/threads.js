import express from "express";

/* Helpers */
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import markdown from "../helpers/markdown.js";

/* Middleware */
import thread_comment from "../controllers/thread_comment.js";
import { get_comment_count, get_comment_replies, get_thread_comments } from "../middlewares/get_comments.js";
import { get_thread, get_threads } from "../middlewares/get_threads.js";

const router = express.Router();

router.get("/", get_threads, (req, res) => {
    res.render("threads", {
        helpers: {
            format_date,
        },
        layout: "forum",
        threads: req.app.get("threads"),
        title: "Threads",
    });
});

router.get(
    "/:thread_id",
    get_thread /* Get thread data */,
    get_thread_comments /* Expand all comments under the thread */,
    get_comment_count /* Count all comments under the thread */,

    (req, res) => {
        res.render("thread", {
            comments: req.app.get("comments"),
            count: req.app.get("count"),
            helpers: {
                check_depth(depth) {
                    return depth >= 5;
                },
                check_id,
                concat,
                format_date,
                markdown,
            },
            layout: "forum",
            thread: req.app.get("thread"),
            title: req.app.get("thread").title,
        });
    }
);

router.get(
    "/:thread_id/comments/:comment_id",
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    (req, res) => {
        res.render("thread", {
            comments: req.app.get("comments"),
            count: req.app.get("count"),
            helpers: {
                check_depth(depth) {
                    return depth >= 5;
                },
                check_id,
                concat,
                format_date,
                markdown,
            },
            layout: "forum",
            reply: true,
            thread: req.app.get("thread"),
            title: req.app.get("comments")[0].content,
        });
    }
);

router.post("/:thread_id/comments", get_thread, get_thread_comments, thread_comment);

export default router;
