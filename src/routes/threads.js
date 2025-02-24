import express from "express";
import { ObjectId } from "mongodb";

/* Helpers */
import check_depth from "../helpers/check_depth.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import is_author from "../helpers/is_author.js";
import markdown from "../helpers/markdown.js";

/* Middleware */
import thread_comment from "../controllers/thread_comment.js";
import { get_comment_count, get_comment_replies, get_thread_comments } from "../middlewares/get_comments.js";
import { get_thread, get_threads } from "../middlewares/get_threads.js";

const router = express.Router();

/* Forum home page */
router.get(
    "/",
    get_threads /* Get thread list */,

    (req, res) => {
        res.render("threads", {
            helpers: {
                format_date,
            },
            layout: "forum",
            threads: req.app.get("threads"),
            title: "Threads",
        });
    }
);

/* Thread page */
router.get(
    "/:thread_id",
    get_thread /* Get thread data */,
    get_thread_comments /* Expand all comments under the thread */,
    get_comment_count /* Count all comments under the thread */,

    (req, res) => {
        /* TODO: This uses a hardcoded value for now. Replace with session data eventually */
        let _is_author = is_author(new ObjectId("67a8caec05494bfdd8a41bf7"));

        res.render("thread", {
            comments: req.app.get("comments"),
            count: req.app.get("count"),
            helpers: {
                _is_author,
                check_depth,
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

/* Comment permalink page (used for pagination) */
router.get(
    "/:thread_id/comments/:comment_id",
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    (req, res) => {
        /* TODO: This uses a hardcoded value for now. Replace with session data eventually */
        let _is_author = is_author(new ObjectId("67a8caec05494bfdd8a41bf7"));

        res.render("thread", {
            comments: req.app.get("comments"),
            count: req.app.get("count"),
            helpers: {
                _is_author,
                check_depth,
                check_id,
                concat,
                format_date,
                markdown,
            },
            layout: "forum",
            reply: true /* Displays "Viewing a comment" instead of "Comments (count)" */,
            thread: req.app.get("thread"),
            title: req.app.get("comments")[0].content,
        });
    }
);

/* Posting a new comment */
router.post(
    "/:thread_id/comments",
    get_thread /* Get thread data */,
    get_thread_comments /* Expand all comments under the thread */,
    thread_comment
);

/* Editing a comment */
router.post(
    "/:thread_id/comments/:comment_id/edit",
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    async (req, res) => {
        let _comments = req.app.get("db").collection("comments");

        _comments.updateOne(
            { _id: req.app.get("comments")[0]._id },
            { $set: { content: req.body.content, edited: new Date(Date.now()) } }
        );

        res.redirect(`/threads/${req.params.thread_id}/comments/${req.params.comment_id}`);
    }
);

/* Deleting a comment */
router.post(
    "/:thread_id/comments/:comment_id/delete",
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    async (req, res) => {
        let _comments = req.app.get("db").collection("comments");

        /* TODO: Actually delete the data */
        _comments.updateOne({ _id: req.app.get("comments")[0]._id }, { $set: { deleted: true } });

        res.redirect(`/threads/${req.params.thread_id}/comments/${req.params.comment_id}`);
    }
);

export default router;
