import express from "express";
import { body } from "express-validator";

import hash_password from "../middlewares/hash_password.js";

import signin_register from "../controllers/signin_register.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

console.log("hi");

router.post(
    "/",

    /* Password minimum length */
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

    /* Username minimum length */
    body("name").isLength({ min: 8 }).withMessage("Username must be at least 8 characters"),

    /* Ensure the username is not already taken */
    body("name").custom(async (username, { req }) => {
        let existing_user = await req.app.get("db").collection("users").findOne({
            name: username, // TODO: Sessions
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

    async (req, res, next) => {
        /* Validation success */ /** I do not know why we're storing the hash after the session is made */
        try {
            const { name } = req.body;
            const users = req.app.get("db").collection("users");

            const result = await users.insertOne({ name, password: res.locals.hashed });

            const newUser = await users.findOne({ _id: result.insertedId });

            req.body.found_user = newUser;
            
            next();
        } catch (error) {
            console.error(error);
        }
    },
    
    signin_register,

    async (req, res) => {
        res.json({ success: true, redirectUrl: "/threads" });
    }
);

export default router;
