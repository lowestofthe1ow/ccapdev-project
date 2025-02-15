import express from "express";
import { engine } from "express-handlebars";

/* MongoDB connection */
import db_conn from "./model/db.js";

/* Routes */
import index from "./routes/index.js";
import forum from "./routes/threads.js";
import register from "./routes/register.js";
import signin from "./routes/signin.js";
import submission from "./routes/submission.js";
import search_tag from "./routes/search_tags.js";

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));

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
app.use("/register", register);
app.use("/signin", signin);
app.use("/submission", submission);
app.use("/tags", search_tag);

/* Connect to MongoDB and begin listening to requests */
db_conn.connect().then(() => {
    app.set("db_conn", db_conn);
    app.set("db", db_conn.db(process.env.MONGODB_DBNAME));

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});
