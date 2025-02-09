import express from "express";
import { get_threads, get_thread } from "../middlewares/threads.js";
import get_comments from "../middlewares/comments.js";
import markdown from "../helpers/markdown.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", get_threads, (req, res) => {
    res.render("threads", {
        title: "Threads",
        helpers: {
            format_date(created) {
                /* TODO: Actually format the date, e.g. "7 hours ago" */
                return created.toLocaleString();
            },
        },
        layout: "forum",
        threads: req.app.get("threads"),
    });
});

router.get("/:id", get_thread, get_comments, (req, res) => {
    res.render("thread", {
        title: req.app.get("thread").title,
        helpers: {
            format_date(created) {
                /* TODO: Actually format the date, e.g. "7 hours ago" */
                return created.toLocaleString();
            },
            markdown,
            count(comments) {
                let total = 0;
                comments.forEach((x) => {
                    total += 1 + x.replies.length;
                });
                return total;
            },
            equal(value1, value2) {
                return value1.equals(value2);
            },
        },
        layout: "forum",
        thread: req.app.get("thread"),
        comments: req.app.get("comments"),
    });
});

router.post("/:id", get_thread, get_comments, async (req, res) => {
    console.log("hi");
    console.log(req.body);

    // let session = req.app.get("db_conn").startSession();
    try {
        /* Fetch from database */
        let _comments = req.app.get("db").collection("comments");

        let comment = {
            author: "lowestofthelow",
            parent: new ObjectId(req.body.parent),
            content: req.body.content,
            children: [],
            vote_count: 0,
            created: new Date(Date.now()),
        };

        let insert_result = await _comments.insertOne(comment);
        await _comments.updateOne({ _id: comment.parent }, { $push: { children: insert_result.insertedId } });

        res.redirect(`/threads/${req.params.id}`);
        //await session.withTransaction(async () => {

        //});
    } catch (error) {
        console.error(error);
    }
});

export default router;
