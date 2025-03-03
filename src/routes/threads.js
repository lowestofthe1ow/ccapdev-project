import express from "express";
import { ObjectId } from "mongodb";

/* Helpers */
import check_depth from "../helpers/check_depth.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import is_author from "../helpers/is_author.js";
import markdown from "../helpers/markdown.js";
import eq from "../helpers/strict_equality.js";

/* Middleware */
import thread_comment from "../controllers/thread_comment.js";
import get_active_user from "../middlewares/get_active_user.js";
import { get_comment_count, get_comment_replies, get_thread_comments } from "../middlewares/get_comments.js";
import { get_thread, get_threads, get_top_threads } from "../middlewares/get_threads.js";
import { get_game_data } from "../middlewares/get_games.js";

const router = express.Router();

/* Forum home page */
router.get(
    "/",
    get_active_user,
    get_threads /* Get thread list */,
    get_top_threads,
    get_game_data,

    (req, res) => {
        res.render("threads", {
            helpers: {
                format_date,
                check_id,
                eq,
            },
            layout: "forum",
            title: "Threads",
        });
    }
);

/* Thread page */
router.get(
    "/:thread_id",
    get_active_user,
    get_thread /* Get thread data */,
    get_top_threads,
    get_game_data,
    get_thread_comments /* Expand all comments under the thread */,
    get_comment_count /* Count all comments under the thread */,

    (req, res) => {
        /* TODO: This uses a hardcoded value for now. Replace with session data eventually */
        let _is_author = is_author(new ObjectId("67a8caec05494bfdd8a41bf7"));

        res.render("thread", {
            helpers: {
                _is_author,
                check_depth,
                check_id,
                concat,
                format_date,
                markdown,
                eq,
            },
            layout: "forum",
            title: res.locals.thread.title,
            restrict_siblings: true,
        });
    }
);

/* Edit thread */
router.post(
    "/:thread_id/edit",
    get_active_user,
    get_thread /* Get thread data */,

    async (req, res) => {
        let _threads = req.app.get("db").collection("threads");

        _threads.updateOne(
            { _id: res.locals.thread._id },
            {
                $set: {
                    content: req.body.content,
                    thumbnail: req.body.content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? "",
                    edited: new Date(Date.now()),
                },
            }
        );

        res.redirect(`/threads/${req.params.thread_id}`);
    }
);

/* Delete thread */
router.post(
    "/:thread_id/delete",
    get_active_user,
    get_thread /* Get thread data */,

    async (req, res) => {
        let _threads = req.app.get("db").collection("threads");

        _threads.updateOne({ _id: res.locals.thread._id }, { $set: { deleted: true } });

        res.redirect(`/threads/${req.params.thread_id}`);
    }
);

/* TODO: Combine the vote stuff*/
/** Vote a comment and post*/
router.post(
    [
        "/:thread_id/vote/:vote_type", // Thread vote
        "/:thread_id/comments/:comment_id/vote/:vote_type", // Comment vote
    ],
    get_active_user,
    get_thread,
    async (req, res, next) => {
        if (req.params.comment_id) {
            return get_comment_replies(req, res, next);
        }
        next();
    },
    async (req, res) => {
        const { vote_type, comment_id } = req.params;
        const user = res.locals.user;
        const isComment = Boolean(comment_id);

        // Check if vote type is up or down
        if (!["up", "down"].includes(vote_type)) {
            return res.status(400).json({ error: "Invalid request" });
        }

        const _collection = req.app.get("db").collection(isComment ? "comments" : "threads");
        const vote_list_key = isComment ? "comment_vote_list" : "thread_vote_list";
        const item = isComment ? res.locals.comments?.[0] : res.locals.thread;

        // Check if deleted
        if (item.deleted) return res.status(403).json({ error: isComment ? "Comment deleted" : "Thread deleted" });

        // SR NOR Latch
        // only one vote can be active
        const _users = req.app.get("db").collection("users");
        //IF null meaning it's not there, assume 0
        const prevVote = user[vote_list_key]?.[item._id.toString()] || 0;
        const newVote = vote_type === "up" ? 1 : -1;

        // Pressing the same vote would negate that vote
        const voteChange = prevVote === newVote ? -prevVote : newVote - prevVote;

        await _users.updateOne(
            { _id: user._id },
            prevVote === newVote
                ? { $unset: { [`${vote_list_key}.${item._id}`]: "" } }
                : { $set: { [`${vote_list_key}.${item._id}`]: newVote } }
        );

        await _collection.updateOne({ _id: item._id }, { $inc: { vote_count: voteChange } });

        const updatedItem = await _collection.findOne({ _id: item._id }, { projection: { vote_count: 1 } });

        res.json({ newVoteCount: updatedItem.vote_count });
    }
);

/* Comment permalink page (used for pagination) */
router.get(
    "/:thread_id/comments/:comment_id",
    get_active_user,
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    (req, res) => {
        /* TODO: This uses a hardcoded value for now. Replace with session data eventually */
        let _is_author = is_author(new ObjectId("67a8caec05494bfdd8a41bf7"));

        res.render("thread", {
            helpers: {
                _is_author,
                check_depth,
                check_id,
                concat,
                format_date,
                markdown,
                eq,
            },
            layout: "forum",
            title: res.locals.comments[0].content,
        });
    }
);

/* Posting a new comment */
router.post(
    "/:thread_id/comments",
    get_active_user,
    /* TODO: Replace this with session middleware */
    (req, res, next) => {
        req.username = "lowestofthelow";
        next();
    },
    get_active_user /* Gets the current active user */,
    get_thread /* Get thread data */,
    get_thread_comments /* Expand all comments under the thread */,
    thread_comment
);

/* Editing a comment */
router.post(
    "/:thread_id/comments/:comment_id/edit",
    get_active_user,
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    async (req, res) => {
        let _comments = req.app.get("db").collection("comments");

        _comments.updateOne(
            { _id: res.locals.comments[0]._id },
            { $set: { content: req.body.content, edited: new Date(Date.now()) } }
        );

        res.redirect(`/threads/${req.params.thread_id}/comments/${req.params.comment_id}`);
    }
);

/* Deleting a comment */
router.post(
    "/:thread_id/comments/:comment_id/delete",
    get_active_user,
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,

    async (req, res) => {
        let _comments = req.app.get("db").collection("comments");

        /* TODO: Actually delete the data */
        _comments.updateOne({ _id: res.locals.comments[0]._id }, { $set: { deleted: true } });

        res.redirect(`/threads/${req.params.thread_id}/comments/${req.params.comment_id}`);
    }
);

export default router;
