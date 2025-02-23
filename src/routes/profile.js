import express from "express";

/* Helpers */
import format_date from "../helpers/format_date.js";

/* Middleware */
import { get_user } from "../middlewares/profile.js";
import { get_threads } from "../middlewares/get_threads.js";

const router = express.Router();

router.get("/", get_threads, get_user, (req, res) => {
    res.render("profile", {
        user: req.app.get("user"),
        layout: "forum",
        threads: req.app.get("threads"),
        helpers: { format_date },
    });
});

export default router;
