import express from "express";
import get_featured from "../middlewares/featured.js";
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

router.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Sign in",
    });
});

router.get("/register", (req, res) => {
    res.render("register", {
        title: "Register",
    });
});


export default router;
