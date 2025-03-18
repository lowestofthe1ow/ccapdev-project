import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
/* MongoDB connection */
import db_conn from "./model/db.js";

/* Routes */
import index from "./routes/index.js";
import profile from "./routes/profile.js";
import register from "./routes/register.js";
import signin from "./routes/signin.js";
import submission from "./routes/submission.js";
import forum from "./routes/threads.js";

const app = express();
const port = 3000;
/* TODO: Remove this HOST */
const host = "192.168.18.34";

app.use(express.urlencoded({ extended: true }));

/* Cookie Parser */
app.use(cookieParser());

/* Setting up session */
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        /* WARNING: DO NOT EVER SET SECURE TO TRUE, NEEDS HTTPS */
        /* For the future: Make the server use https */
        rolling: true,
        store: MongoStore.create({
            dbName: process.env.MONGODB_DBNAME,
            collectionName: "sessions",
            mongoUrl: encodeURI(process.env.MONGODB_URI + "/" + process.env.MONGODB_DBNAME),
            autoRemove: "interval",
            autoRemoveInterval: 10,
            ttl: 60 * 30 /* ask sir what's the default ttl for unremembered users*/ /* Set to 30 mins */,
        }),
        cookie: { httpOnly: true, secure: false, maxAge: null },
    })
);

/* Use the handlebars engine */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

/* Set src/views as the views directory */
app.set("views", "src/views");

/* Serve static content from the public directory */
app.use("/", express.static("public"));

/* Set routers */
app.use("/", index);
app.use("/threads", forum);
app.use("/profile", profile);
app.use("/register", register);
app.use("/signin", signin);
app.use("/submission", submission);

/* Connect to MongoDB and begin listening to requests */
db_conn.connect().then(async () => {
    app.set("db_conn", db_conn);
    app.set("db", db_conn.db(process.env.MONGODB_DBNAME)); 
    const db = db_conn.db(process.env.MONGODB_DBNAME);
    const users = db.collection("users");

    await users.createIndex(
        { name: 1 },
        { unique: true,  // Unique index, unique
          sparse: true,} // Sparse index, means that it does not "count" documents where a certain field is gone, in this case name
    );

    /* The new way delete works 

    if user removes their account, remove the field called name
    
    */
    

    app.set("db_conn", db_conn);
    app.set("db", db);
    app.listen(port, host, () => {
        console.log(`Listening on port http://${host}:${port}.`);
    });
});
