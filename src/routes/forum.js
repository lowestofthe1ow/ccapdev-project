import express from "express";
import get_featured from "../middlewares/featured.js";

const router = express.Router();

router.get("/", get_featured, (req, res) => {
    res.render("threads", {
        title: "Home",
        layout: "forum",
        threads: [
            {
                vote_count: 69,
                tags: ["A"],
                games: ["Blue Archive"],
                author: "lowestofthelow",
                date: "5 hours ago",
                title: "Damn gg",
            },
        ],
    });
});

export default router;
