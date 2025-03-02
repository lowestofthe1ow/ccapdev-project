import express from "express";
import get_featured from "../middlewares/get_featured.js";
import redirect_threads from "../middlewares/session_exists.js";
import destroy_session from "../middlewares/destroy_session.js";

import argon2 from "argon2";

const router = express.Router();


// idk which one actually works, just keep it here for now
router.use(express.urlencoded({ extended: true }))
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


export default router;
