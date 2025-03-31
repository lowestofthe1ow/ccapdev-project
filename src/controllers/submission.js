import { ObjectId } from "mongodb";

export default async (req, res) => {
    try {
        const _threads = req.app.get("db").collection("threads");

        /** Is there a way to use the schema or something */
        const newThread = {
            author: new ObjectId(res.locals.user._id),
            comments: [],
            content: req.body.content.trim() || "",
            created: new Date(),
            games: JSON.parse(req.body.games),
            tags: JSON.parse(req.body.tags),
            thumbnail: req.body.content.match(/!\[.*?\]\((.*?)\)/)?.[1] ?? "",
            title: req.body.title?.trim() || "",
            vote_count: 0,
        };

        const result = await _threads.insertOne(newThread);

        if (!result.insertedId) {
            return res.status(500).json({ error: "Failed to create thread" });
        }

        res.redirect(`/threads/${result.insertedId}`);
    } catch (error) {
        console.error(error);
    }
};
