import express from "express";
import { get_featured_games } from "../middlewares/get_games.js";
import redirect_threads from "../middlewares/session_exists.js";

const router = express.Router();

// idk which one actually works, just keep it here for now
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", get_featured_games, (req, res) => {
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

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, message: "Failed to destroy session." });
            } else {
                res.clearCookie("connect.sid");
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
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

router.get("/games", async (req, res) => {
    try {
        /* Search for games based on a query */
        const _games = req.app.get("db").collection("games");
        const query = req.query.q || "";
        const games = await _games.find({ name: { $regex: query, $options: "i" } }).toArray();

        /* Return an array of only the names */
        res.json(games.map((tag) => tag.name));
    } catch (error) {
        console.error(error);
    }
});

export default router;
