import express from "express";
import { ObjectId } from "mongodb";
import { get_game_banners } from "../middlewares/get_games.js";
import { get_active_user } from "../middlewares/get_session.js";
import { body } from "express-validator";
import check_form_errors from "../middlewares/check_form_errors.js";

import eq from "../helpers/strict_equality.js";

const router = express.Router();

/** Get route for submission, renders the page where form is */
router.get("/", get_active_user, get_game_banners, async (req, res) => {
    res.render("submission", {
        layout: "forum",
        title: "Create Post",
        helpers: { eq },
    });
});

/** Post route for submission, creates the post*/
router.post("/", get_active_user,
    body("submit__editor").custom(async (title, { req }) => {
        if(req.body.content == "")
            throw new Error("Content cannot be empty");
        else if(req.body.title == "")
            throw new Error("Title cannot be empty");
        else
            return true;
    }),

    check_form_errors,

    async (req, res) => {
    try {
        const _threads = req.app.get("db").collection("threads");

        /** Is there a way to use the schema or something */
        const newThread = {
            author: new ObjectId(res.locals.user._id),
            comments: [],
            content: req.body.content.trim() || "",
            created: new Date(),
            games: JSON.parse(req.body.games),
            tags: JSON.parse(req.body.tags),
            thumbnail: req.body.content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? "",
            title: req.body.title?.trim() || "",
            vote_count: 0,
        };

        const result = await _threads.insertOne(newThread);

        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create thread" });
        }

        res.redirect(`/threads/${result.insertedId}`);
    } catch (error) {
        console.error(error);
    }
});

export default router;
