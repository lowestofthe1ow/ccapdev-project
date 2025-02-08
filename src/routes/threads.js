import express from "express";
import get_threads from "../middlewares/threads.js";

const router = express.Router();

router.get("/", get_threads, (req, res) => {
    console.log(req.app.get("threads"));
    res.render("threads", {
        title: "Home",
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

export default router;
