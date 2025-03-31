import express from "express";
import { body } from "express-validator";
import check_form_errors from "../middlewares/check_form_errors.js";
import { get_game_banners } from "../middlewares/get_games.js";
import { get_active_user } from "../middlewares/get_session.js";

import eq from "../helpers/strict_equality.js";
import submission from "../controllers/submission.js";

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
router.post(
    "/",
    get_active_user,
    body("submit__editor").custom(async (title, { req }) => {
        if (req.body.content == "") throw new Error("Content cannot be empty");
        else if (req.body.title == "") throw new Error("Title cannot be empty");
        else return true;
    }),

    check_form_errors,
    submission
);

export default router;
