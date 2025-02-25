import express from "express";

/* Helpers */
import format_date from "../helpers/format_date.js";

/* Middleware */
import get_active_user from "../middlewares/get_active_user.js";
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
            threads: req.app.get("threads"),
            helpers: { format_date },
        });
    }
);

export default router;
