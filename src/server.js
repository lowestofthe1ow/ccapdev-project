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
            mongoUrl: encodeURIComponent(process.env.MONGODB_URI + "/" + process.env.MONGODB_DBNAME),
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
db_conn.connect().then(() => {
    app.set("db_conn", db_conn);
    app.set("db", db_conn.db(process.env.MONGODB_DBNAME));

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});
