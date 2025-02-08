import express from "express";
import { get_threads, get_thread } from "../middlewares/threads.js";

const router = express.Router();

router.get("/", get_threads, (req, res) => {
    console.log(req.app.get("threads"));
    res.render("threads", {
        title: "Threads",
        helpers: {
            format_date(created) {
                /* TODO: Actually format the date, e.g. "7 hours ago" */
                return created.toLocaleString();
            },
        },
        layout: "forum",
        threads: req.app.get("threads"),
    });
});

router.get("/:id", get_thread, (req, res) => {
    res.render("thread", {
        title: req.app.get("thread").title,
        helpers: {
            format_date(created) {
                /* TODO: Actually format the date, e.g. "7 hours ago" */
                return created.toLocaleString();
            },
        },
        layout: "forum",
        thread: req.app.get("thread"),
    });
});

export default router;
