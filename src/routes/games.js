import express from "express";
import { getGames } from "../middlewares/get_games.js";

const router = express.Router();

router.get("/", getGames, (req, res) => {
    res.json(req.games);
});

export default router;
