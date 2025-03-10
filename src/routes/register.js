import express from "express";
import { body } from "express-validator";

import check_form_errors from "../middlewares/check_form_errors.js";
import { check_existing_session } from "../middlewares/get_session.js";
import hash_password from "../middlewares/hash_password.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post(
    "/",
    check_existing_session,
    /* Password minimum length */
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

    /* Username minimum length */
    body("name").isLength({ min: 8 }).withMessage("Username must be at least 8 characters"),

    /* Ensure the username is not already taken */
    body("name").custom(async (username, { req }) => {
        let existing_user = await req.app.get("db").collection("users").findOne({
            name: username,
        });
        if (existing_user) {
            throw new Error("Username already in use");
        } else {
            return true;
        }
    }),

    /* Ensure the passwords match */
    body("confirm").custom((confirm, { req }) => {
        if (confirm != req.body.password) {
            throw new Error("Passwords do not match");
        } else {
            return true;
        }
    }),

    hash_password /* Hash the password */,

    check_form_errors /* Abort if validation failed */,

    /* Data should be VALID by this point */

    async (req, res, next) => {
        try {
            const { name } = req.body;
            const users = req.app.get("db").collection("users");
            /* Red edited this part to test something */
            const result = await users.insertOne({ name, password: res.locals.hashed, 
                                                    thread_vote_list: {},
                                                    comment_vote_list: {},
                                                    pfp: "/img/default_avatar.svg",
                                                    banner: "",
                                                    bio: "",
                                                    deleted: false, });
            const verify_insertion = await users.findOne({ _id: result.insertedId });

            req.body.found_user = verify_insertion;

            next();
        } catch (error) {
            console.error(error);
        }
    },

    /* By this point, found_user is the newly-created user (or null if some weird error happened */

    /* Attach user ID to session */
    /* TODO: Combine with the one in signin.js UNLESS something comes up */
    async (req, res) => {
        if (req.body.found_user) {
            req.session.user_id = req.body.found_user._id;
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21;
                req.session.rememberMe = true;
            }
            res.json({ success: true, redirectUrl: "/threads" });
        } else {
            res.status(400).json({ success: false, message: "User authentication failed." });
        }
    }
);

export default router;
