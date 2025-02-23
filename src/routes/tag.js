import express from "express";
import { getTags } from "../middlewares/get_tags.js";

const router = express.Router();

router.get("/", getTags, (req, res) => {
    res.json(req.tags);
});

export default router;
