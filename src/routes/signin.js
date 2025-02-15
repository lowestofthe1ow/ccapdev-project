import express from "express";

import { find_user } from "../middlewares/users.js";
import { validate_password } from "../middlewares/validate.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/", find_user, validate_password, async (req, res) => {
    try {
        res.json({ success: true, redirectUrl: "/threads" });
    } catch (error) {
        console.error(error);
    }
});

export default router;
