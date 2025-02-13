import db_conn from "./db.js";

/* Schema validators */
import comments from "./schemas/comments.js";
import threads from "./schemas/threads.js";

db_conn.connect().then(async () => {
    let db = db_conn.db(process.env.MONGODB_DBNAME);

    /* Create the `comments` collection */
    await db.collection("comments").drop();
    await db.createCollection("comments", {
        validator: comments,
    });

    /* Create the `threads` collection */
    await db.collection("threads").drop();
    await db.createCollection("threads", {
        validator: threads,
    });

    db_conn.close();
});
