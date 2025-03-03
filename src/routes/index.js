import express from "express";
import get_featured from "../middlewares/get_featured.js";
import redirect_threads from "../middlewares/session_exists.js";
import destroy_session from "../middlewares/destroy_session.js";

import argon2 from "argon2";

const router = express.Router();

// idk which one actually works, just keep it here for now
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", get_featured, (req, res) => {
    res.render("index", {
        /* Include gallery of randomly selected featured games */
        images: req.app.get("featured"),
        title: "Home",
    });
});

router.get("/signin", redirect_threads, (req, res) => {
    res.render("signin", {
        title: "Sign in",
    });
});

router.get("/register", redirect_threads, (req, res) => {
    res.render("register", {
        title: "Register",
    });
});

/** TODO instead of having multiple active_user check make a unifiied check */
router.get("/logout", destroy_session, (req, res) => {
    res.render("index", {
        /* Include gallery of randomly selected featured games */
        images: req.app.get("featured"),
        title: "Home",
    });
});

/* TODO move this to another route maybe or like export the controller but I'm lazy */
router.get("/tags", async (req, res) => {
    try {
        const tags_db = req.app.get("db").collection("threads");
        const searchQuery = req.query.q || "";

        const tags = await tags_db
            .aggregate([
                {
                    $unwind: "$tags",
                },
                {
                    $match: {
                        tags: {
                            $regex: searchQuery,
                            $options: "i",
                        },
                        deleted: { $ne: true },
                    },
                },
                {
                    $group: {
                        _id: "$tags",
                        tag: {
                            $first: "$tags",
                        },
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        tag: 1,
                        count: 1,
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
            ])
            .toArray();

        req.games = res.json(tags.map((tag) => tag.tag));
    } catch (error) {
        console.error(error);
    }
});

export default router;
