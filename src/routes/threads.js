import express from "express";

/* Helpers */
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import count_comments from "../helpers/count_comments.js";
import format_date from "../helpers/format_date.js";
import markdown from "../helpers/markdown.js";

/* Middleware */
import get_comments from "../middlewares/get_comments.js";
import { get_thread, get_threads } from "../middlewares/get_threads.js";
import thread_comment from "../controllers/thread_comment.js";

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

router.get("/:id", get_thread, get_comments, (req, res) => {
    res.render("thread", {
        comments: req.app.get("comments"),
        helpers: {
            check_id,
            concat,
            count_comments,
            format_date,
            markdown,
        },
        layout: "forum",
        thread: req.app.get("thread"),
        title: req.app.get("thread").title,
    });
});

router.post("/:id/comments", get_thread, get_comments, thread_comment);

export default router;
