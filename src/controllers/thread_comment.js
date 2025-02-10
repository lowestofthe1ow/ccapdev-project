import { ObjectId } from "mongodb";

/**
 * Controller for adding new comments to a thread. Processes POST requests to /threads/:id/comments
 *
 * @param req - The request body
 * @param res - The response body
 */
export default async (req, res) => {
    try {
        /* Fetch from database */
        let _comments = req.app.get("db").collection("comments");

        /* Create a comment object from the request body */
        let comment = {
            author: "lowestofthelow" /* Sample user for now */,
            thread: req.app.get("thread")._id,
            children: [],
            content: req.body.content,
            created: new Date(Date.now()),
            parent: new ObjectId(req.body.parent),
            vote_count: 0,
        };

        /* TODO: Look into atomic transactions with MongoDB sessions */
        let insert_result = await _comments.insertOne(comment);

        if (req.body.type == "reply") {
            /* If comment is a reply */
            await _comments.updateOne({ _id: comment.parent }, { $push: { children: insert_result.insertedId } });
        } else if (req.body.type == "comment") {
            /* If comment is a top-level comment */
            let _threads = req.app.get("db").collection("threads");
            /* TODO: Better schema lol */
            await _threads.updateOne({ _id: comment.parent }, { $push: { comments: insert_result.insertedId } });
        }

        /* Redirect to GET /threads/:id */
        res.redirect(`/threads/${req.params.id}`);
    } catch (error) {
        console.error(error);
    }
};
