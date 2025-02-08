import express from "express";
import get_featured from "../middlewares/featured.js";

const router = express.Router();

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
