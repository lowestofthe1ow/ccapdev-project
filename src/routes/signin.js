import argon2 from "argon2";
import express from "express";
import { body } from "express-validator";

import check_form_errors from "../middlewares/check_form_errors.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post(
    "/",

    /* Ensure the user exists in the database */
    body("name").custom(async (username, { req }) => {
        let existing_user = await req.app.get("db").collection("users").findOne({
            name: username, // TODO: Sessions
        });

        if (!existing_user) {
            throw new Error("No such user exists");
        } else {
            /* Genuinely I have no idea how to best pass this along the chain so lol */
            req.body.found_user = existing_user;
            return true;
        }
    }),

    /* Ensure the password is valid */
    body("password").custom(async (password, { req }) => {
        if (!req.body.found_user) return false; /* Skip entirely if user not found */

        const valid = await argon2.verify(req.body.found_user.password, password);

        if (!valid) {
            throw new Error("Invalid password");
        } else {
            return true;
        }
    }),

    check_form_errors,

    /* Data should be VALID by this point */

    /* Attach user ID to session */
    async (req, res) => {
        if (req.body.found_user) {
            req.session.user_id = req.body.found_user._id;
            res.json({ success: true, redirectUrl: "/threads" });
        } else {
            res.status(400).json({ success: false, message: "User authentication failed." });
        }
    }
);

export default router;
