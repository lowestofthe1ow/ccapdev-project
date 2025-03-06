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
import get_active_user from "../middlewares/get_active_user.js";
import get_visited_user from "../middlewares/get_visited_user.js";
import check_user from "../middlewares/check_user.js";
import { get_thread_comments } from "../middlewares/get_comments.js";
import { get_upvoted_threads } from "../middlewares/get_threads.js";
import { get_user_threads } from "../middlewares/get_threads.js";
import check_form_errors from "../middlewares/check_form_errors.js";

const router = express.Router();

router.get(
    "/:user_id",
    /* TODO: Replace this with session middleware */
    get_visited_user,
    check_user,
    get_user_threads /* Fetches thread list */,
    async (req, res) => {
        res.render("profile", {
            layout: "forum",
            helpers: { format_date, eq },
            visiteduser: await req.app
                    .get("db")
                    .collection("users")
                    .findOne({
                        _id: new ObjectId(req.params.user_id)
                    }),
        });
    }
);

router.get(
    "/comments/:user_id",
    /* TODO: Replace this with session middleware */
    get_visited_user /* Gets the visited user */,
    check_user,
    async (req, res) => {
        res.render("pfcomments", {
            layout: "forum",
            helpers: {
                check_depth,
                check_id,
                concat,
                format_date,
                markdown,
                eq,
            },
            visiteduser: await req.app
                    .get("db")
                    .collection("users")
                    .findOne({
                        _id: new ObjectId(req.params.user_id)
                    })
        });
    }
);

router.get(
    "/upvoted/:user_id",
    /* TODO: Replace this with session middleware */
    get_visited_user,
    check_user,
    get_upvoted_threads /* Fetches thread list */,
    async (req, res) => {
        res.render("pfupvoted", {
            layout: "forum",
            helpers: { format_date, eq },
            visiteduser: await req.app
                    .get("db")
                    .collection("users")
                    .findOne({
                        _id: new ObjectId(req.params.user_id)
                    })
        });
    }
);

router.get(
    "/edit/:user_id",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the visited user */,
    (req, res) => {
        res.render("pfedit", {
            layout: "forum",
        });
    }
);

router.post(
    "/edit/:user_id",
    /* TODO: Replace this with session middleware */
    get_active_user /* Gets the visited user */,
    body("name").custom(async (username, { req }) => {
        let existing_user = await req.app.get("db").collection("users").findOne({
            name: username,
        });

        if (existing_user) {
            throw new Error("Username already in use");
        } else {
            return true;
        }
    }),

    check_form_errors,

    async (req, res) => {
        console.log("help");

        let _users = req.app.get("db").collection("users");

        if( req.body.pfp === "" && req.body.banner === "" ) {
            _users.updateOne({ _id: res.locals.user._id }, { $set: { name: req.body.name,
                                                                    bio: req.body.content
                                                                    } });
        }
        else if( req.body.pfp === "") {
            _users.updateOne({ _id: res.locals.user._id }, { $set: { name: req.body.name,
                                                                    bio: req.body.content,
                                                                    banner: req.body.banner
                                                                    } });
        }
        else if( req.body.banner === "") {
            _users.updateOne({ _id: res.locals.user._id }, { $set: { name: req.body.name,
                                                                    bio: req.body.content,
                                                                    pfp: req.body.pfp
                                                                    } });
        }
        else {
            _users.updateOne({ _id: res.locals.user._id }, { $set: { name: req.body.name,
                                                                    bio: req.body.content,
                                                                    pfp: req.body.pfp,
                                                                    banner: req.body.banner
                                                                    } });
        }

        res.json({ success: true, redirectUrl: "/profile/edit/:user_id" });
    },
);

export default router;