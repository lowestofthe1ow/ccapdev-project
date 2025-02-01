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

export default router;
