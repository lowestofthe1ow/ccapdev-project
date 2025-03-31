export default async (req, res) => {
    const { vote_type, comment_id } = req.params;
    const user = res.locals.user;
    const isComment = Boolean(comment_id);

    // Check if vote type is up or down
    if (!["up", "down"].includes(vote_type)) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const _collection = req.app.get("db").collection(isComment ? "comments" : "threads");
    const vote_list_key = isComment ? "comment_vote_list" : "thread_vote_list";
    const item = isComment ? res.locals.comments?.[0] : res.locals.thread;

    // Check if deleted
    if (item.deleted) return res.status(403).json({ error: isComment ? "Comment deleted" : "Thread deleted" });

    // SR NOR Latch
    // only one vote can be active
    const _users = req.app.get("db").collection("users");
    //IF null meaning it's not there, assume 0
    const prevVote = user[vote_list_key]?.[item._id.toString()] || 0;
    const newVote = vote_type === "up" ? 1 : -1;

    // Pressing the same vote would negate that vote
    const voteChange = prevVote === newVote ? -prevVote : newVote - prevVote;

    await _users.updateOne(
        { _id: user._id },
        prevVote === newVote
            ? { $unset: { [`${vote_list_key}.${item._id}`]: "" } }
            : { $set: { [`${vote_list_key}.${item._id}`]: newVote } }
    );

    await _collection.updateOne({ _id: item._id }, { $inc: { vote_count: voteChange } });

    const updatedItem = await _collection.findOne({ _id: item._id }, { projection: { vote_count: 1 } });

    res.json({ success: true, newVoteCount: updatedItem.vote_count });
};
