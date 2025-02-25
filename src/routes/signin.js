import argon2 from "argon2";
import express from "express";
import { body } from "express-validator";

import signin_register from "../controllers/signin_register.js";

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
            req.found_user = existing_user;
            return true;
        }
    }),

    /* Ensure the password is valid */
    body("password").custom(async (password, { req }) => {
        if (!req.found_user) return false; /* Skip entirely if user not found */

        const valid = await argon2.verify(req.found_user.password, password);

        if (!valid) {
            throw new Error("Invalid password");
        } else {
            return true;
        }
    }),

    signin_register,

    (req, res) => {
        res.json({ success: true, redirectUrl: "/threads" });
    }
);

export default router;
