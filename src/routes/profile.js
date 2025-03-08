import { ObjectId } from "mongodb";

import express from "express";
import { body } from "express-validator";

/* Helpers */
import check_depth from "../helpers/check_depth.js";
import check_id from "../helpers/check_id.js";
import concat from "../helpers/concat.js";
import format_date from "../helpers/format_date.js";
import markdown from "../helpers/markdown.js";
import eq from "../helpers/strict_equality.js";

/* Middleware */
import check_form_errors from "../middlewares/check_form_errors.js";
import { get_user_comments } from "../middlewares/get_comments.js";
import get_display_user from "../middlewares/get_display_user.js";
import { get_game_banners } from "../middlewares/get_games.js";
import { get_active_user } from "../middlewares/get_session.js";
import { get_top_threads, get_upvoted_threads, get_user_threads } from "../middlewares/get_threads.js";

const router = express.Router();

/* Profile landing page (redirects to active user profile) */
router.get("/", get_active_user, async (req, res) => {
    res.redirect("/profile/" + res.locals.user._id);
});

/* Edit profile view (only for active user) */
router.get(
    "/edit",
    get_active_user /* Gets the active user */,
    get_game_banners,

    (req, res) => {
        res.render("profile_edit", {
            layout: "forum",
            helpers: { eq },
        });
    }
);

/* Accept edit profile requests */
router.post(
    "/edit",
    get_active_user /* Gets the active user */,

    /* Put the active user object in request body for use in validation later */
    (req, res, next) => {
        req.body.user = res.locals.user;
        next();
    },

    /* Check if username already exists */
    body("name").custom(async (username, { req }) => {
        if (!username) {
            return true;
        }

        let existing_user = await req.app.get("db").collection("users").findOne({
            name: username,
        });

        /* Allow in the case that the username exists if IDs match */
        if (existing_user && !req.body.user._id.equals(existing_user._id)) {
            throw new Error("Username already in use");
        } else {
            return true;
        }
    }),

    check_form_errors /* Throw any errors */,

    async (req, res) => {
        let _users = req.app.get("db").collection("users");

        /* TODO: I don't think this is needed anymore
        if (req.body.pfp === "" && req.body.banner === "") {
            _users.updateOne({ _id: res.locals.user._id }, { $set: { name: req.body.name, bio: req.body.content } });
        } else if (req.body.pfp === "") {
            _users.updateOne(
                { _id: res.locals.user._id },
                { $set: { name: req.body.name, bio: req.body.content, banner: req.body.banner } }
            );
        } else if (req.body.banner === "") {
            _users.updateOne(
                { _id: res.locals.user._id },
                { $set: { name: req.body.name, bio: req.body.content, pfp: req.body.pfp } }
            );
        } else {
            _users.updateOne(
                { _id: res.locals.user._id },
                { $set: { name: req.body.name, bio: req.body.content, pfp: req.body.pfp, banner: req.body.banner } }
            );
        } */

        _users.updateOne(
            { _id: res.locals.user._id },
            {
                $set: {
                    ...(req.body.name && { name: req.body.name }),
                    ...(req.body.content && { bio: req.body.content }),
                    /* Allow these fields to have "empty values" */
                    ...{ pfp: req.body.pfp, banner: req.body.banner },
                },
            }
        );

        res.json({ success: true, redirectUrl: "/profile/edit" });
    }
);

/* Visit a specific profile page */
router.get(
    "/:user_id",
    get_active_user,
    get_display_user,
    get_game_banners,
    get_user_threads /* Fetches thread list */,
    get_top_threads,

    async (req, res) => {
        res.render("profile", {
            layout: "forum",
            show_edit: req.session.user_id == req.params.user_id,
            helpers: {
                eq,
                format_date,
                markdown,
            },
        });
    }
);

/* Comments tab */
router.get(
    "/:user_id/comments",
    get_active_user /* Gets the visited user */,
    get_display_user,
    get_game_banners,
    get_user_comments,
    get_top_threads,

    async (req, res) => {
        res.render("profile_comments", {
            layout: "forum",
            show_edit: req.session.user_id == req.params.user_id,
            helpers: {
                check_depth,
                check_id,
                concat,
                eq,
                format_date,
                markdown,
            },
        });
    }
);

/* Upvoted tab */
router.get(
    "/:user_id/upvoted",
    get_active_user,
    get_display_user,
    get_game_banners,
    get_upvoted_threads /* Fetches thread list */,
    get_top_threads,

    async (req, res) => {
        res.render("profile_upvoted", {
            layout: "forum",
            show_edit: req.session.user_id == req.params.user_id,
            helpers: {
                eq,
                format_date,
                markdown,
            },
        });
    }
);

/* Handle deletes */
router.post(
    "/delete",
    get_active_user /* Gets the current active user */,
    get_display_user,
    get_game_banners,

    async (req, res) => {
        try {
            const users = req.app.get("db").collection("users");

            await users.updateOne(
                { _id: new ObjectId(req.session.user_id) },
                {
                    $set: { deleted: true, name: null }, // Soft delete user
                }
            );

            req.session.destroy(() => {
                res.redirect("/");
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);

export default router;
