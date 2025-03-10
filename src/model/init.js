import fs from "fs";

import db_conn from "./db.js";

/* Schema validators */
import comments from "./schemas/comments.js";
import games from "./schemas/games.js";
import sessions from "./schemas/sessions.js";
import threads from "./schemas/threads.js";
import users from "./schemas/users.js";
import { ObjectId } from "mongodb";

async function load_from_file(db, collection, url) {
    try {
        const data = JSON.parse(fs.readFileSync(url, "utf-8"));
        data.forEach((record) => {
            record._id = new ObjectId(record._id.$oid);

            if (record.author) {
                record.author = new ObjectId(record.author.$oid);
            }

            if (record.parent) {
                record.parent = new ObjectId(record.parent.$oid);
            }

            if (record.thread) {
                record.thread = new ObjectId(record.thread.$oid);
            }

            if (record.created) {
                record.created = new Date(record.created.$date);
            }

            if (record.edited) {
                record.edited = new Date(record.edited.$date);
            }

            if (record.children) {
                record.children = record.children.map((x) => new ObjectId(x.$oid));
            }

            if (record.comments) {
                record.comments = record.comments.map((x) => new ObjectId(x.$oid));
            }
        });
        await db.collection(collection).insertMany(data);
    } catch (error) {
        console.dir(error, { depth: null });
    }
}

async function load_from_file_by_author_name(db, collection, url) {
    try {
        const data = JSON.parse(fs.readFileSync(url, "utf-8"));
        await db.collection(collection).insertMany(data);
    } catch (error) {
        console.error(error);
    }
}

db_conn.connect().then(async () => {
    const db = db_conn.db(process.env.MONGODB_DBNAME);

    /* Create the `comments` collection */
    await db.collection("comments").drop();
    await db.createCollection("comments", {
        validator: comments,
    });

    /* Create the `games` collection */
    await db.collection("games").drop();
    await db.createCollection("games", {
        validator: games,
    });

    /* Create the `sessions` collection */
    await db.collection("sessions").drop();
    await db.createCollection("sessions", {
        validator: sessions,
    });

    /* Create the `threads` collection */
    await db.collection("threads").drop();
    await db.createCollection("threads", {
        validator: threads,
    });

    /* Create the `users` collection */
    await db.collection("users").drop();
    await db.createCollection("users", {
        validator: users,
    });

    await load_from_file(db, "games", "src/model/data/games.json");
    await load_from_file(db, "users", "src/model/data/users.json");
    await load_from_file(db, "threads", "src/model/data/threads.json");
    await load_from_file(db, "comments", "src/model/data/comments.json");

    db_conn.close();
});
