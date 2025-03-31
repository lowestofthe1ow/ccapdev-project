import express from "express";

/* Helpers */
import check_depth from "../helpers/check_depth.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import markdown from "../helpers/markdown.js";
import eq from "../helpers/strict_equality.js";

/* Middleware */
import { get_comment_count, get_comment_replies, get_thread_comments } from "../middlewares/get_comments.js";
import { get_game_banners, get_game_data } from "../middlewares/get_games.js";
import { allow_guest_session, get_active_user } from "../middlewares/get_session.js";
import { get_thread, get_threads, get_top_threads } from "../middlewares/get_threads.js";

/* Controllers */
import thread_comment from "../controllers/thread_comment.js";
import vote from "../controllers/vote.js";

const router = express.Router();

/* Forum home page */
router.get(
    "/",
    allow_guest_session,
    get_threads /* Get thread list */,
    get_top_threads,
    get_game_data,
    get_game_banners,

    (req, res) => {
        res.render("threads", {
            helpers: {
                check_id,
                eq,
                format_date,
            },
            layout: "forum",
            title: req.query.search ? "Results for " + req.query.search : "Threads",
        });
    }
);

/* Thread page */
router.get(
    "/:thread_id",
    allow_guest_session,
    get_thread /* Get thread data */,
    get_top_threads,
    get_game_data,
    get_game_banners,
    get_thread_comments /* Expand all comments under the thread */,
    get_comment_count /* Count all comments under the thread */,

    (req, res) => {
        res.render("thread", {
            helpers: {
                check_depth,
                check_id,
                concat,
                eq,
                format_date,
                markdown,
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
                    content: req.body.content.trim() || "",
                    games: JSON.parse(req.body.games),
                    tags: JSON.parse(req.body.tags),
                    thumbnail: req.body.content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? "",
                    title: req.body.title?.trim() || "",
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
    vote
);

/* Comment permalink page (used for pagination) */
router.get(
    "/:thread_id/comments/:comment_id",
    allow_guest_session,
    get_thread /* Get thread data */,
    get_comment_replies /* Expand all comments under a specific comment */,
    get_game_banners,

    (req, res) => {
        res.render("thread", {
            helpers: {
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
