import express from "express";

import { find_user } from "../middlewares/users.js";
import { hash_password } from "../middlewares/hashing.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/", find_user, hash_password, async (req, res) => {
    try {
        const { name } = req.body;
        const users = req.app.get("db").collection("users");

        await users.insertOne({ name, password: req.app.get("hashed-password") });

        res.json({ success: true, redirectUrl: "/threads" });
    } catch (error) {
        console.error(error);
    }
});

export default router;
